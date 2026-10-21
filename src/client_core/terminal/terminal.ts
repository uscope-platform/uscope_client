// Copyright 2021 Filippo Savi
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

// @ts-ignore
import 'xterm/css/xterm.css';

import {terminal_backend, type TerminalCommand} from './terminal_backend.js'
import {xterm_colors} from "./terminal_colors.js";
import {history} from "./terminal_history.js";
import {terminal_options, prompt, prompt_width, banner} from "./terminal_theme.js";
import {autocompletion_engine, prefix} from "../scripting/autocompletion_engine.js";

// set by the clear command, the prompt that follows is on the first row already
let screen_cleared = false;

/// The commands of the terminal itself, the ones acting on the registers are in terminal_backend
const builtins: Record<string, TerminalCommand> = {
    help: (args: string[]): Promise<string[]> =>{
        if(args[0] === "--help"){
            return Promise.resolve([
                "HELP:",
                "This command lists the commands, or describes one of them",
                "format: help [COMMAND]"
            ]);
        }
        if(args[0] === undefined) return help_overview();
        let command = commands[args[0]];
        if(command === undefined) return Promise.reject(["ERROR: Unrecognized command: " + args[0]]);
        return command(["--help"]);
    },
    clear: (args: string[]): Promise<string[]> =>{
        if(args[0] === "--help"){
            return Promise.resolve([
                "CLEAR:",
                "This command clears the screen",
                "format: clear"
            ]);
        }
        // the screen and the scrollback
        terminal.write("\x1b[3J\x1b[2J\x1b[H");
        screen_cleared = true;
        return Promise.resolve([]);
    }
}

const commands: Record<string, TerminalCommand> = {...terminal_backend, ...builtins};
const recognised_commands = Object.keys(commands);

/// One line for each command, from the description in its help
const help_overview = async (): Promise<string[]> =>{
    let lines: string[] = [];
    for(let [name, command] of Object.entries(commands).sort(([a], [b]) => a.localeCompare(b))){
        let description = await command(["--help"]);
        // "This command reads the register" is listed as "reads the register"
        lines.push(name.padEnd(14) + (description[1] ?? "").replace(/^This command /, ""));
    }
    lines.push("", "help [COMMAND] shows the details of a command");
    return lines;
}

export let current_line: string = "";
// where the cursor is in the line
let cursor = 0;

export let terminal: Terminal;

let fitAddon: FitAddon;
let resize_observer: ResizeObserver | undefined;

export const init_terminal = (): Terminal | undefined => {
    terminal = new Terminal({
        convertEol: true,
        ...terminal_options
        // rendererType: "dom" // default is canvas
    });

    // ctrl+c copies the selection, it would be sent to the terminal otherwise
    terminal.attachCustomKeyEventHandler((event) => {
        if(event.type === "keydown" && event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === "c" && terminal.hasSelection()){
            void navigator.clipboard?.writeText(terminal.getSelection());
            return false;
        }
        return true;
    });

    // Load Fit Addon
    fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    // Open the terminal in #terminal-container
    let term_element = document.getElementById("xterm");
    if(!term_element) {
        console.error("Error: #xterm not found");
        return
    }
    terminal.open(term_element);
    // Make the terminal's size and geometry fit the size of #terminal-container
    fitAddon.fit();
    // ... and keep it so, it was fitted only once, whatever the container became afterwards
    resize_observer = new ResizeObserver(() => fitAddon.fit());
    resize_observer.observe(term_element);
    terminal.onData((domEvent) => {
        // in order: what is typed while a command runs waits for it
        input_chain = input_chain.then(() => handle_input(domEvent)).catch(console.error);
    })
    terminal.write(banner);
    display_prompt()

    return terminal;
};

/// Releases the terminal, to be called when it goes away from the page: a new one is created next time
export const dispose_terminal = () => {
    resize_observer?.disconnect();
    terminal?.dispose();
    current_line = "";
    cursor = 0;
    // a command still running must not hold the input of the next terminal
    input_chain = Promise.resolve();
};


const VERSION_COMPONENTS = ["client", "server", "driver", "module", "hardware", "toolchain"];
// the commands taking a peripheral, register or field
const ADDRESS_COMMANDS = ["write", "write_direct", "read"];

interface completion {
    // the text replacing the word before the cursor
    word: string;
    // the candidates to list, when the word can not be extended
    suggestions: string[];
    // whether the word is complete, so that a space can follow
    done: boolean;
}

/// What completes the word that ends at the cursor
const complete = (before_cursor: string): completion | null =>{
    let words = before_cursor.trimStart().split(/ +/);
    let index = words.length - 1;
    let current = words[index] ?? "";
    let command = words[0] ?? "";

    let candidates: string[];
    // the names before the one being completed, in peripheral.register.field
    let stem = "";
    let whole_names = true;
    if(index === 0 || (index === 1 && command === "help")){
        candidates = recognised_commands.filter((item)=> item.startsWith(current));
    } else if(index === 1 && command === "version"){
        candidates = VERSION_COMPONENTS.filter((item)=> item.startsWith(current));
    } else if(index === 1 && ADDRESS_COMMANDS.includes(command)){
        stem = current.slice(0, current.lastIndexOf(".") + 1);
        // THE OBJECT IS UNECESSARY, HOWEVER IT ALLOWS THE USE OF THE SAME INTERFACE AS IN JS SCRIPTS
        let options = autocompletion_engine({from:0, to:1, text:"this." + current}, true);
        candidates = options.map((item)=> item.label).filter((item)=> item.startsWith(current.slice(stem.length)));
        // a name is followed by a dot or a space, the user knows which
        whole_names = false;
    } else {
        return null;
    }

    candidates = [...new Set(candidates)].sort();
    if(candidates.length === 0) return null;
    let common = prefix(candidates);
    return {
        word: stem + common,
        suggestions: candidates.length > 1 && common.length <= current.length - stem.length ? candidates : [],
        done: candidates.length === 1 && whole_names
    };
}

/// Lays the items out in columns, as many as the width of the terminal allows
const format_columns = (items: string[]): string[] =>{
    let width = Math.max(...items.map((item)=> item.length)) + 2;
    let per_row = Math.max(1, Math.floor(terminal.cols / width));
    let rows: string[] = [];
    for(let i = 0; i < items.length; i += per_row){
        rows.push(items.slice(i, i + per_row).map((item)=> item.padEnd(width)).join("").trimEnd());
    }
    return rows;
}

export const handle_tab = () =>{
    let before = current_line.slice(0, cursor);
    let result = complete(before);
    if(result === null) return;

    if(result.suggestions.length > 0){
        // listed below the line, which is then drawn again where it was
        let position = cursor;
        finish_line();
        terminal.write("\r\n");
        for(let row of format_columns(result.suggestions)){
            terminal.write(xterm_colors.blue + row + xterm_colors.white + "\r\n");
        }
        cursor = position;
        render();
    } else {
        let word = before.split(/ +/).pop() ?? "";
        // a complete word gets a space, unless one follows already
        let space = result.done && !current_line.startsWith(" ", cursor) ? " " : "";
        let completed = before.slice(0, before.length - word.length) + result.word + space;
        current_line = completed + current_line.slice(cursor);
        cursor = completed.length;
        render();
    }
}

/// Splits a command line in words: the text between quotes is kept together, a name can have spaces, and several
/// spaces count as one
export const tokenize = (line: string): string[] => {
    let tokens: string[] = [];
    let current = "";
    // true in a word, also when it is empty ("")
    let in_word = false;
    let quote: string | null = null;
    for(let character of line){
        if(quote !== null){
            if(character === quote) quote = null;
            else current += character;
        } else if(character === '"' || character === "'"){
            quote = character;
            in_word = true;
        } else if(/\s/.test(character)){
            if(in_word) tokens.push(current);
            current = "";
            in_word = false;
        } else {
            current += character;
            in_word = true;
        }
    }
    if(in_word) tokens.push(current);
    return tokens;
}

export const execute_command = (command_line: string): Promise<void> => {
    let tokens = tokenize(command_line);
    let command =  tokens.shift();
    // a line of spaces
    if(command === undefined) return Promise.resolve();
    if(!recognised_commands.includes(command)){
        terminal.write("\r\n" + xterm_colors.brightRed + "Unrecognized command: " + command + xterm_colors.white);
        return new Promise((resolve)=>{
            resolve();
        });
    }
    let selected_function = commands[command];
    if(selected_function === undefined){

        terminal.write("\r\n" + xterm_colors.brightRed + "Error: command not found" + xterm_colors.white);
        return new Promise((resolve)=>{
            resolve();
        });
    }
    let result: Promise<string[]>;
    try {
        result = selected_function(tokens);
    } catch (error) {
        // a command failing before returning its promise would leave the terminal without a prompt
        result = Promise.reject(error);
    }
    return result.then((response: any)=>{
        for (const line of response) {
            terminal.write("\r\n" + xterm_colors.green + line + xterm_colors.white);
        }
    }).catch((response: any) =>{
        for (const line of as_lines(response)) {
            terminal.write("\r\n" + xterm_colors.brightRed + line + xterm_colors.white);
        }
    });


}

// the commands reject with the lines to print, an error or a string must not be printed one character per line
const as_lines = (response: unknown): string[] => {
    if(Array.isArray(response)) return response;
    if(response instanceof Error) return [response.message];
    return [String(response)];
}

/// Draws the prompt and the line again, with the cursor at its place. It starts from the first row of the line, which
/// can wrap on several
const render = () => {
    let cols = terminal.cols;
    // the rows of the line above the one of the cursor, as the terminal has them (a calculation would be wrong after
    // the terminal changed size, and the line wrapped differently)
    let buffer = terminal.buffer.active;
    let rows_up = 0;
    for(let y = buffer.baseY + buffer.cursorY; buffer.getLine(y)?.isWrapped; y--) rows_up++;
    let end = prompt_width + current_line.length;
    let out = (rows_up > 0 ? `\x1b[${rows_up}A` : "") + "\r\x1b[J" + prompt + current_line;
    // a line filling its last row leaves the cursor waiting before the wrap, which would make its row ambiguous: force it
    if(end % cols === 0) out += " \r";
    let wanted = prompt_width + cursor;
    if(wanted !== end){
        let rows_back = Math.floor(end / cols) - Math.floor(wanted / cols);
        out += (rows_back > 0 ? `\x1b[${rows_back}A` : "") + "\r" + (wanted % cols > 0 ? `\x1b[${wanted % cols}C` : "");
    }
    terminal.write(out);
}

/// Replaces the line being edited with another one, with the cursor at its end
export const replace_line = (line: string) => {
    current_line = line;
    cursor = line.length;
    render();
}

const move_cursor = (position: number) => {
    cursor = Math.min(Math.max(position, 0), current_line.length);
    render();
}

/// Puts the cursor at the end of the line, to write below it
const finish_line = () => {
    if(cursor !== current_line.length) move_cursor(current_line.length);
}

const word_start = (from: number) => {
    let i = from;
    while(i > 0 && current_line[i - 1] === " ") i--;
    while(i > 0 && current_line[i - 1] !== " ") i--;
    return i;
}

const word_end = (from: number) => {
    let i = from;
    while(i < current_line.length && current_line[i] === " ") i++;
    while(i < current_line.length && current_line[i] !== " ") i++;
    return i;
}

export const handle_history = (older: boolean) => {
    let line = older ? history.previous(current_line) : history.next();
    if(line !== null) replace_line(line);
}

export const handle_return = ()=>{
    history.add(current_line);
    history.reset_navigation();
    // the output goes below the line, not in the middle of it
    finish_line();
    if(current_line.length>0){
        return execute_command(current_line).finally(()=>{
                current_line = "";
                cursor = 0;
                display_prompt();
            }
        );
    } else {
        return new Promise((resolve)=>{
            display_prompt();
            resolve("");
        })
    }

};

export const handle_delete = () =>{
    if(cursor === 0) return;
    current_line = current_line.slice(0, cursor - 1) + current_line.slice(cursor);
    cursor--;
    render();
}

export const handle_letter = (key:string) => {
    current_line = current_line.slice(0, cursor) + key + current_line.slice(cursor);
    cursor += key.length;
    render();
}

/// The keys moving the cursor and deleting in the line. Returns false for the other ones
const handle_edit_key = (key: string): boolean => {
    switch(key){
        case "\x1b[D":
        case "\x1bOD":
            move_cursor(cursor - 1);
            return true;
        case "\x1b[C":
        case "\x1bOC":
            move_cursor(cursor + 1);
            return true;
        case "\x1b[H":
        case "\x1bOH":
        case "\x1b[1~":
        case "\x01":
            move_cursor(0);
            return true;
        case "\x1b[F":
        case "\x1bOF":
        case "\x1b[4~":
        case "\x05":
            move_cursor(current_line.length);
            return true;
        // word by word, with alt or ctrl (alt+b and alt+f where alt is the meta key)
        case "\x1b[1;3D":
        case "\x1b[1;5D":
        case "\x1bb":
            move_cursor(word_start(cursor));
            return true;
        case "\x1b[1;3C":
        case "\x1b[1;5C":
        case "\x1bf":
            move_cursor(word_end(cursor));
            return true;
        case "\x1b[3~":
            current_line = current_line.slice(0, cursor) + current_line.slice(cursor + 1);
            render();
            return true;
        // ctrl+u and ctrl+k: delete up to the start, and to the end of the line
        case "\x15":
            current_line = current_line.slice(cursor);
            cursor = 0;
            render();
            return true;
        case "\x0b":
            current_line = current_line.slice(0, cursor);
            render();
            return true;
    }
    return false;
}

let input_chain: Promise<unknown> = Promise.resolve();

// a key, an escape sequence, a run of printable text, or any other single character
const INPUT_TOKEN = /\x1b\[[0-9;]*[A-Za-z~]|\x1bO[A-Za-z]|\x1b[A-Za-z]|\x1b|[^\x00-\x1f\x7f\x1b]+|[\s\S]/gu;

/// What the terminal sends is one key, but a pasted text arrives in one piece with its line breaks: it is handled as
/// the keys it is made of, one after the other (a command has to be over before the next key)
export const handle_input = async (data: string) => {
    for(let key of data.replace(/\r?\n/g, "\r").match(INPUT_TOKEN) ?? []){
        await handle_keypress(key);
    }
}

export const handle_keypress = (key: string) => {
    if (key === "\r") {
        return handle_return();
    } else if (key === "") {
        handle_delete();
    } else if (key === "\t") {
        handle_tab();
    } else if (key === "\x1b[A" || key === "\x1bOA") {
        handle_history(true);
    } else if (key === "\x1b[B" || key === "\x1bOB") {
        handle_history(false);
    } else if (key === "\x1b[5~") {
        terminal.scrollPages(-1);
    } else if (key === "\x1b[6~") {
        terminal.scrollPages(1);
    } else if (handle_edit_key(key)) {
        return;
    } else if (key.startsWith("\x1b") || key < " ") {
        // the other escape sequences and control characters are not handled, they would end up as text in the line
        return;
    } else {
        handle_letter(key);
    }
}

export const display_prompt = () => {
    terminal.write((screen_cleared ? "\r" : "\r\n") + prompt);
    screen_cleared = false;
};
