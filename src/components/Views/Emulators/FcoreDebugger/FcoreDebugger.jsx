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


import React, {useState} from 'react';
import {Fcore} from "./FcoreLanguage.js";
import TextEditor from "../../../UI_elements/TextEditor.jsx";
import DebuggerControls from "./DebuggerControls";
import {cpp} from "@codemirror/lang-cpp";
import MemoryViewer from "./MemoryViewer.jsx";
import {EditorView} from "codemirror";

let  FcoreDebugger = props =>{


    let [current_line, set_current_line] = useState(1);

    let handle_run = async ()=>{
        await props.emulator.debug_run();
    }

    let handle_step = async () =>{
        await props.emulator.step_over();
    }

    let handle_resume = async () =>{
        await props.emulator.resume();
    };

    let produce_theme = () =>{
        let base_theme = {}
        base_theme['.cm-line:nth-of-type(' + current_line + ')'] = {
            backgroundColor: 'blue'
        }
        return base_theme;
    }

    const highLight = EditorView.theme(produce_theme());


    return (
        <div>
            <DebuggerControls
                run={handle_run}
                step={handle_step}
                resume={handle_resume}
            />
            <div style={{
                display: "grid",
                gap: 10,
                gridTemplateRows: "3fr 1fr",
            }}>
                <div style={{
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "1fr 1fr",
                }}>
                    <TextEditor
                        tab_name="Assembly"
                        content={props.content.asm}
                        extensions={[Fcore(), highLight]}
                    />
                    <TextEditor
                        tab_name="C source"
                        content={props.content.source}
                        extensions={[cpp()]}
                    />
                </div>
                <MemoryViewer/>
            </div>
        </div>
            );
            };

            export default FcoreDebugger;
