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
import 'xterm/css/xterm.css';

import {terminal_backend} from './terminal_backend'
import {xterm_colors} from "./terminal_colors";
import {autocompletion_engine} from "../scripting/autocompletion_engine";

const recognised_commands = Object.keys(terminal_backend);

export let current_line = "";

export let terminal = null;

const fitAddon = new FitAddon();

export const init_terminal = () => {
    terminal = new Terminal({
        convertEol: true,
        fontFamily: `'Fira Mono', monospace`,
        fontSize: 15,
        fontWeight: 900
        // rendererType: "dom" // default is canvas
    });
    //Styling
    terminal.options.theme = {
        background: "black",
        foreground: "white"
    };

    // Load Fit Addon
    terminal.loadAddon(fitAddon);
    // Open the terminal in #terminal-container
    terminal.open(document.getElementById("xterm"));
    // Make the terminal's size and geometry fit the size of #terminal-container
    fitAddon.fit();
    terminal.onData((domEvent) => {
        handle_keypress(domEvent);
    })
    display_prompt()

    return terminal;
};


export const prefix = (words) => {

    if (!words[0] || words.length ===  1) return words[0] || "";
    let i = 0;
    while(words[0][i] && words.every(w => w[i] === words[0][i]))
        i++;

    return words[0].substring(0, i);
}



export const complete_command = () =>{
    let complete_command = recognised_commands.includes(current_line);

    let candidates = recognised_commands.filter((command)=>{
        return command.startsWith(current_line);
    })
    if(candidates.length === 1){
        display_prompt();
        current_line = candidates[0];
        terminal.write(candidates[0]);
    } else if(candidates.length >1){
        if(!complete_command){
            current_line = prefix(candidates);
        }
        terminal.write("\r\n" + xterm_colors.blue + candidates.join("   ")  +  xterm_colors.white);
        display_prompt();
        terminal.write(current_line);
    }
}

export const complete_address = () =>{
    let tokens = current_line.split(" ")
    switch (tokens[0]){
        case 'write':
        case 'write_direct':
        case 'read':
            // THIS OBJECT IS UNECESSARY, HOWEVER IT ALLOWS THE USE OF THE SAME INTERFACE AS IN JS SCRIPTS
            let line = {
                from:0,
                to:1,
                text:"this."+tokens[1]
            }
            let options = autocompletion_engine( line,true);
            let candidates = options.map((item)=>{
                return item.label;
            });
            if(candidates.length === 1){
                let present_substr = tokens[1].split(".").pop()
                let missing = candidates[0].replace(present_substr, "");
                current_line = current_line + missing;
                terminal.write(missing);
            } else {
                for (let i = 0; i < candidates.length; i += 5) {
                    terminal.write("\r\n" + xterm_colors.blue + candidates.slice(i, i + 5).join("         ")  +  xterm_colors.white);
                }
                display_prompt();
                terminal.write(current_line);
            }
            break
        default:
            break;
    }
}


export const handle_tab = () =>{
    switch(current_line.split(" ").length-1){
        case 0:
            complete_command();
            break;
        case 1:
            complete_address();
            break;
        default:
            break;
    }
}

export const execute_command = (command_line) => {
    let tokens = command_line.split(" ");
    let command =  tokens.shift();
    if(!recognised_commands.includes(command)){
        terminal.write("\r\n" + xterm_colors.brightRed + "Unrecognized command: " + command + xterm_colors.white);
        return new Promise((resolve)=>{
            resolve([]);
        });
    }

    return terminal_backend[command](tokens).then((response)=>{
        for (const line of response) {
            terminal.write("\r\n" + xterm_colors.green + line + xterm_colors.white);
        }
    }).catch((response) =>{
        for (const line of response) {
            terminal.write("\r\n" + xterm_colors.brightRed + line + xterm_colors.white);
        }
    });


}

export const handle_return = ()=>{
    if(current_line.length>0){
        return execute_command(current_line).then(()=>{
                current_line = "";
                display_prompt();
            }
        );
    } else {
        return new Promise((resolve)=>{
            display_prompt();
            resolve();
        })
    }

};

export const handle_delete = () =>{
    if(current_line.length === 0) return;
    terminal.write("\b \b");
    current_line = current_line.slice(0, -1);
}

export const handle_letter = (key) => {
    current_line =  current_line + key;
    terminal.write(key);
}

export const handle_keypress = (key) => {
    if (key === "\r") {
        return handle_return();
    } else if (key === "") {
        handle_delete();
    } else if (key === "\t") {
        handle_tab();
    } else {
        handle_letter(key);
    }
}

export const display_prompt = () => {
    let shellprompt = "$ ";
    terminal.write("\r\n" + shellprompt);
};


////////////////////////////MOCKED TERMINAL FOR TESTING/////////////

let _term_content = [];

let terminal_mock = {
    _test_get_content:()=>{
        return _term_content;
    },
    _test_clear_buffer:()=>{
        _term_content = [];
    },
    write:(line)=>{
        _term_content.push(line);
    }
}

export const  init_test_terminal = () =>{
    terminal = terminal_mock;
}

export const set_current_line = (line) =>{
    current_line = line;
}