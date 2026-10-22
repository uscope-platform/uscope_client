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
import {activePalette} from "#UI/themes.js";
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
    theme: activePalette.terminal
};


export const prompt = c.brightGreen + "uscope" + c.reset + c.dim + "$" + c.reset + " ";
// the width of the prompt on the screen, without the escape sequences
export const prompt_width = "uscope$ ".length;

export const banner = c.bold + "uscope terminal" + c.reset + c.dim + "  type help for the list of commands" + c.reset;
