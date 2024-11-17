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


import React from 'react';
import {Fcore} from "./FcoreLanguage.js";
import TextEditor from "../../../UI_elements/TextEditor.jsx";
import DebuggerControls from "./DebuggerControls";
import {cpp} from "@codemirror/lang-cpp";

let  FcoreDebugger = props =>{


    let handle_run = ()=>{

        let spec = {};

        let command = {
            command: "run",
            arguments: spec,
        };
    }

    let handle_stop = () =>{

    }

    let handle_step = () =>{


        let command = {
            command: "spec",
            arguments: 0,
        };

    }

    let handle_resume = () =>{
        let command = {
            command: "continue",
            arguments: 0,
        };

    };


    let handle_add_breakpoint = (line_n) =>{
        let command = {
            command: "add_breakpoint",
            arguments: line_n
        };

    };

    let handle_remove_breakpoint = (line_n) =>{
        let command = {
            command: "remove_breakpoint",
            arguments: line_n
        };

    };

    return (
        <div>
            <DebuggerControls
                run={handle_run}
                stop={handle_stop}
                step={handle_step}
                continue={handle_resume}
            />
            <div style={{
                display:"grid",
                gap: 10,
                gridTemplateColumns: "1fr 1fr"
            }}>
                <TextEditor
                    tab_name="Assembly"
                    content={props.content.asm}
                    extensions={[Fcore()]}
                />
                <TextEditor
                    tab_name="C source"
                    content={props.content.source}
                    extensions={[cpp()]}
                />
            </div>
        </div>
    );
};

export default FcoreDebugger;
