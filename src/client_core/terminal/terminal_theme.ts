// Copyright 2026 Filippo Savi
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

import type {ITerminalOptions} from "xterm";
import {xterm_colors as c} from "./terminal_colors.js";

/// How the terminal looks. The background is also the one of the container of the terminal (Terminal.tsx)
export const terminal_options: ITerminalOptions = {
    fontFamily: `"Fira Mono", "SF Mono", Menlo, Monaco, Consolas, "DejaVu Sans Mono", "Liberation Mono", monospace`,
    fontSize: 13,
    lineHeight: 1.25,
    cursorBlink: true,
    cursorStyle: "bar",
    cursorWidth: 2,
    scrollback: 5000,
    theme: {
        background: "#0c0c0c",
        foreground: "#e6e6e6",
        cursor: "#ffb545",
        cursorAccent: "#0c0c0c",
        selectionBackground: "rgba(255,181,69,0.3)",
        // the default dark blue is hard to read on a dark background
        black: "#1e1e1e",
        red: "#ff6b6b",
        green: "#7ee787",
        yellow: "#f5d76e",
        blue: "#6cb6ff",
        magenta: "#d2a8ff",
        cyan: "#56d4dd",
        white: "#e6e6e6",
        brightBlack: "#6e7681",
        brightRed: "#ff8e8e",
        brightGreen: "#9ef0a6",
        brightYellow: "#ffe58f",
        brightBlue: "#9ccbff",
        brightMagenta: "#e2c5ff",
        brightCyan: "#86e8ef",
        brightWhite: "#ffffff"
    }
};

export const prompt = c.brightGreen + "uscope" + c.reset + c.dim + "$" + c.reset + " ";
// the width of the prompt on the screen, without the escape sequences
export const prompt_width = "uscope$ ".length;

export const banner = c.bold + "uscope terminal" + c.reset + c.dim + "  type help for the list of commands" + c.reset;
