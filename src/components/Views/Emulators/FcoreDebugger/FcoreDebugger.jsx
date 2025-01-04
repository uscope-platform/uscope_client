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
import {TextEditor} from "../../../UI_elements";
import DebuggerControls from "./DebuggerControls";
import {cpp} from "@codemirror/lang-cpp";
import MemoryViewer from "./MemoryViewer.jsx";
import {EditorView} from "codemirror";
import IoViewer from "./IoViewer.jsx";
import {toast, ToastContainer} from "react-toastify";
import {up_emulator_result} from "../../../../client_core/index.js";
import TranslationTable from "../Sidebar/TranslationTable.jsx";

let  FcoreDebugger = props =>{

    let [visualization_type, set_visualization_type] = useState("float");
    let [current_inputs, set_current_inputs] = useState({names:[], values:[]});


    let handle_run = async ()=>{

        let res = await props.emulator.debug_run();
        if(res.status === "in_progress"){
            set_current_inputs({
                names:Object.keys(res.inputs),
                values: Object.values(res.inputs)
            })
            props.set_checkpoint(res);
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
            set_current_inputs({
                names:Object.keys(results.inputs),
                values: Object.values(results.inputs)
            })
            props.set_checkpoint(results);
        }else {

        }
    }

    let handle_resume = async () =>{
        await props.emulator.resume(props.selected_program);
    };

    let produce_theme = () =>{
        let base_theme = {}
        if(props.checkpoint.breakpoint>=0){
            base_theme['.cm-line:nth-of-type(' + String(props.checkpoint.breakpoint+1) + ')'] = {
                backgroundColor: 'rgb(139, 233, 253)'
            }
        }
        return base_theme;
    }

    const highLight = EditorView.theme(produce_theme());


    return (
        <div style={{flexGrow:1}}>
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
                gridTemplateRows: "3fr 1fr",
                height:"56em"
            }}>
                <div style={{
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "repeat(6, 1fr)",
                    height:"56em"
                }}>
                    <div style={{
                        gridArea: "1 / 1 / 2 / 4"
                    }}>
                        <TextEditor
                            tab_name="Assembly"
                            height="30em"
                            content={props.content.asm.program}
                            extensions={[Fcore(), highLight]}
                        />
                    </div>
                    <div style={{
                        gridArea: "1 / 4 / 2 / 7"
                    }}>
                        <TextEditor
                            tab_name="C source"
                            height="30em"
                            content={props.content.source}
                            extensions={[cpp()]}
                        />
                    </div>
                    <div style={{
                        gridArea: "2 / 1 / 3 / 3"
                    }}>
                        <MemoryViewer
                            vis_type={visualization_type}
                            memory={props.checkpoint.memory_view}
                        />
                    </div>
                    <div style={{
                        gridArea: "2 / 3 / 3 / 5"
                    }}>
                        <IoViewer
                            vis_type={visualization_type}
                            io={{names: current_inputs.names, values: current_inputs.values}}
                        />
                    </div>
                    <div style={{
                        gridArea: "2 / 5 / 3 / 7"
                    }}>
                        <TranslationTable
                            data={props.content.asm.translation_table}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FcoreDebugger;
