// Copyright 2024 Filippo Savi
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


import {EditorView, GutterMarker, gutter} from "@codemirror/view";
import {Prec} from "@codemirror/state";
import {ColorTheme} from "#UI/index.js";

class BreakpointMarker extends GutterMarker {
    toDOM() {
        const dot = document.createElement("div");
        dot.className = "cm-breakpoint-dot";
        return dot;
    }
}

const marker = new BreakpointMarker();

const theme = EditorView.baseTheme({
    ".cm-breakpoint-gutter .cm-gutterElement": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1.6em",
        cursor: "pointer",
    },
    ".cm-breakpoint-dot": {
        width: "0.8em",
        height: "0.8em",
        borderRadius: "50%",
        background: ColorTheme.field.error,
    },
    // where a click would put a breakpoint
    ".cm-breakpoint-gutter .cm-gutterElement:hover::before": {
        content: '""',
        width: "0.8em",
        height: "0.8em",
        borderRadius: "50%",
        background: ColorTheme.field.error,
        opacity: "0.35",
    },
});

/// A gutter on the left of the lines of the editor: a dot on the lines with a breakpoint (1 based numbers), a click on
/// a line asks to toggle the breakpoint of it
export const breakpoint_gutter = (lines: number[], on_toggle: (line: number) => void) => {
    const with_breakpoint = new Set(lines);
    return [
        // before the line numbers
        Prec.high(gutter({
            class: "cm-breakpoint-gutter",
            lineMarker: (view, line) => with_breakpoint.has(view.state.doc.lineAt(line.from).number) ? marker : null,
            initialSpacer: () => marker,
            domEventHandlers: {
                mousedown: (view, line) => {
                    on_toggle(view.state.doc.lineAt(line.from).number);
                    return true;
                },
            },
        })),
        theme,
    ];
};
