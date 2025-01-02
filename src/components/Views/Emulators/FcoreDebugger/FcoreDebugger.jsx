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
import IoViewer from "./IoViewer.jsx";
import {toast, ToastContainer} from "react-toastify";
import {up_emulator_result} from "../../../../client_core/index.js";

let  FcoreDebugger = props =>{

    let [visualization_type, set_visualization_type] = useState("float");
    let [current_memory, set_current_memory] = useState([]);
    let [current_line, set_current_line] = useState(0);
    let [current_inputs, set_current_inputs] = useState({names:[], values:[]});

    let handle_run = async ()=>{

        let res = await props.emulator.debug_run();
        if(res.status === "in_progress"){
            set_current_line(res.breakpoint+1);
            set_current_memory(res.memory_view);
            set_current_inputs({
                names:Object.keys(res.inputs),
                values: Object.values(res.inputs)
            })
        } else {
            let results = new up_emulator_result(res.emulation_result, {});
            props.on_emulation_end(results);
            toast.success('Emulation complete');
        }

    }

    let handle_step = async () =>{
        let results = await props.emulator.step_over(props.selected_program);
        if(results.status === "in_progress"){
            if(results.completed_round){
                props.on_program_select(results.next_program);
            }
            set_current_line( results.breakpoint+1);
            set_current_memory(results.memory_view);
            set_current_inputs({
                names:Object.keys(results.inputs),
                values: Object.values(results.inputs)
            })
        }else {

        }
    }

    let handle_resume = async () =>{
        await props.emulator.resume(props.selected_program);
    };

    let produce_theme = () =>{
        let base_theme = {}
        if(current_line>0){
            base_theme['.cm-line:nth-of-type(' + current_line + ')'] = {
                backgroundColor: 'rgb(139, 233, 253)'
            }
        }
        return base_theme;
    }

    const highLight = EditorView.theme(produce_theme());


    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <DebuggerControls
                select_types={set_visualization_type}
                run={handle_run}
                step={handle_step}
                resume={handle_resume}
            />
            <div style={{
                display: "grid",
                gap: 10,
                gridTemplateRows: "3fr 1fr"
            }}>
                <div style={{
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "1fr 1fr",
                }}>
                    <TextEditor
                        tab_name="Assembly"
                        height="30em"
                        content={props.content.asm.program}
                        extensions={[Fcore(), highLight]}
                    />
                    <TextEditor
                        tab_name="C source"
                        height="30em"
                        content={props.content.source}
                        extensions={[cpp()]}
                    />
                    <MemoryViewer
                        vis_type={visualization_type}
                        memory={current_memory}
                    />
                    <IoViewer
                        vis_type={visualization_type}
                        io={{names: current_inputs.names, values: current_inputs.values}}
                    />
                </div>
            </div>
        </div>
            );
            };

            export default FcoreDebugger;
