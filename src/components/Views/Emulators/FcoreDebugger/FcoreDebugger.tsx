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
import {breakpoint_gutter} from "./breakpoint_gutter.js";
import {ColorTheme, TextEditor, UIPanel} from "#UI/index.js";
import {PanelTitle} from "#UI/panels/UIPanel.js";
import DebuggerToolbar from "./DebuggerToolbar.jsx";
import {cpp} from "@codemirror/lang-cpp";
import MemoryViewer from "./MemoryViewer.jsx";
import {EditorView} from "codemirror";
import IoViewer from "./IoViewer.jsx";
import {toast} from "react-toastify";
import {up_emulator_result, up_emulator} from "#client_core/index.js";
import TranslationTable from "../Sidebar/TranslationTable.jsx";
import type {DebuggerCheckpoint, SingleProgramDataPackage} from "#interfaces/index.js";

interface FcoreDebuggerProps {
    emulator: up_emulator
    set_checkpoint: (channel_io_names: DebuggerCheckpoint) => void
    on_emulation_end: (res: up_emulator_result) => void
    selected_program: string,
    on_program_select: (program: string) => void,
    checkpoint: DebuggerCheckpoint,
    content: SingleProgramDataPackage,
    // the lines of the assembly with a breakpoint, 1 based
    breakpoints: number[],
    on_toggle_breakpoint: (line: number) => void,
}

// the tables under the editors have a height of their own, the editors take what is left
const TABLES_HEIGHT = "13em";
// what the page header and the tabs take from the window, the debugger is at least as tall as what is left
const PAGE_CHROME = "225px";

// a panel whose content fills the height that the panel is given
let FillPanel = (props: {title: string, children: React.ReactNode}) => (
    <UIPanel level="level_2" style={{minHeight: 0}}>
        <PanelTitle selected>
            <p style={{marginLeft:"0.5em", marginRight:"0.5em", marginTop:"0.25em", paddingBottom:"0.1m"}}>{props.title}</p>
        </PanelTitle>
        <div style={{flex: 1, minHeight: 0, position: "relative", borderTop: "3px solid " + ColorTheme.background.borders}}>
            <div style={{position: "absolute", inset: 0}}>
                {props.children}
            </div>
        </div>
    </UIPanel>
);

let  FcoreDebugger = (props: FcoreDebuggerProps) =>{

    let [visualization_type, set_visualization_type] = useState("float");
    let [current_inputs, set_current_inputs] = useState<{names:string[], values:number[]}>({names:[], values:[]});


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
        let base_theme: Record<string, any> = {}
        if(props.checkpoint.breakpoint>=0){
            base_theme['.cm-line:nth-of-type(' + String(props.checkpoint.breakpoint+1) + ')'] = {
                backgroundColor: ColorTheme.background.transparent_accents
            }
        }
        return base_theme;
    }

    const highLight = EditorView.theme(produce_theme());

    const gutter_extension = breakpoint_gutter(props.breakpoints, props.on_toggle_breakpoint);


    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flexGrow: 1,
            minWidth: 0,
            height: "100%",
            minHeight: "calc(100vh - " + PAGE_CHROME + ")"
        }}>
            <UIPanel key="debugger_toolbar" level="level_2">
                <DebuggerToolbar
                    run={handle_run}
                    step={handle_step}
                    resume={handle_resume}
                    vis_type={visualization_type}
                    on_vis_type={set_visualization_type}
                    checkpoint={props.checkpoint}
                />
            </UIPanel>
            <div style={{display: "grid", gap: 10, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", flex: 1, minHeight: "16em"}}>
                <FillPanel title="Assembly">
                    <TextEditor
                        height="100%"
                        content={props.content.asm.program}
                        extensions={[Fcore(), highLight, gutter_extension]}
                    />
                </FillPanel>
                <FillPanel title="C source">
                    <TextEditor
                        height="100%"
                        content={props.content.source}
                        extensions={[cpp()]}
                    />
                </FillPanel>
            </div>
            <div style={{display: "grid", gap: 10, gridTemplateColumns: "repeat(3, minmax(0, 1fr))"}}>
                <MemoryViewer
                    height={TABLES_HEIGHT}
                    vis_type={visualization_type}
                    memory={props.checkpoint.memory_view}
                />
                <IoViewer
                    height={TABLES_HEIGHT}
                    vis_type={visualization_type}
                    io={{names: current_inputs.names, values: current_inputs.values}}
                />
                <TranslationTable
                    height={TABLES_HEIGHT}
                    channel_io={props.content.asm.translation_table}
                    common_io={props.content.asm.common_io_translation_table}
                />
            </div>
        </div>
    );
};

export default FcoreDebugger;
