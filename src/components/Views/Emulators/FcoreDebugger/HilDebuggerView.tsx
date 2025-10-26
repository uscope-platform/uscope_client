// Copyright 2025 Filippo Savi
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

import React, {useEffect, useState} from 'react';
import FcoreDebugger from "./FcoreDebugger.jsx";
import HilDebuggerSidebar from "../Sidebar/per_panel_sidebars/HilDebuggerSidebar.jsx";
import {useAppSelector} from "#redux/hooks.js";
import type {DebuggerCheckpoint, EmulatorSelections, SingleProgramDataPackage} from "#interfaces/index.js";
import {up_emulator, up_emulator_result} from "#client_core/index.js";
import type {DecompiledPrograms} from "#interfaces/emulator_view.js";

interface HilDebuggerViewProps {
    emulator:up_emulator,
    on_select: (sel: number) => void,
    set_selections: (sel:EmulatorSelections)=>void,
    set_emulation_results: (res: up_emulator_result) => void
    selections: EmulatorSelections
}

let HilDebuggerView = function (props: HilDebuggerViewProps) {


    let[ debugger_data, set_debugger_data] = useState<SingleProgramDataPackage>({
        asm:{
            translation_table:[],
            common_io_translation_table:[],
            program:""
        },
        source:""
    });

    let [checkpoint, set_checkpoint] = useState<DebuggerCheckpoint>({
        breakpoint:1,
        memory_view:[],
        inputs:{},
        status:"",
        core_name:"",
        next_program:"",
        progress:{
            current:0,
            total_steps:1,
            period:0
        },
        completed_round:false
    });

    let [breakpoints, set_breakpoints] = useState<number[]>([]);

    let [compiled_programs, set_compiled_programs] = useState<Record<string, DecompiledPrograms>>({});

    const programs_store = useAppSelector(state => state.programs);


    let handle_add_breakpoint = async (value: number) =>{
        if(value>0){
            await props.emulator.add_breakpoint(props.selections.program, (value-1));
            set_breakpoints([...breakpoints, (value)]);
        }
    }

    let handle_remove_breakpoint = async (raw_val: number) =>{
        await props.emulator.remove_breakpoint(props.selections.program, raw_val-1);
        let new_breakpoints = breakpoints.filter(b =>{
            return b !== raw_val;
        });
        set_breakpoints(new_breakpoints);
    }


    let handle_select_program = async (value: string)=>{
        props.set_selections({...props.selections, program: value});

        let program = Object.values(props.emulator.cores).filter(c =>{
            return c.name === value;
        })[0];
        if(program === undefined) return;

        let src = Object.values(programs_store).filter(p =>{
            return p.name === program.program;
        })[0].content;

        let cp = compiled_programs[value];
        if(cp === undefined) return;

        set_debugger_data({asm:cp, source:src});

        let bps= await props.emulator.get_breakpoints(value);

        set_breakpoints(bps.map((b: number)=>b+1));
    }


    useEffect(()=>{
        if(props.emulator){
            props.emulator.disassemble().then((asm)=>{
                props.emulator.debug_init().then(()=>{
                    set_compiled_programs(asm);
                });
            })
        }
    }, [props.emulator])

    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:10,
            height:"100%"
        }}>
            <FcoreDebugger
                emulator={props.emulator}
                selected_program={props.selections.program}
                on_program_select={handle_select_program}
                content={debugger_data}
                on_emulation_end={props.set_emulation_results}
                checkpoint={checkpoint}
                set_checkpoint={set_checkpoint}
            />
            <HilDebuggerSidebar
                emulator={props.emulator}
                selections={props.selections}
                set_selections={props.set_selections}
                on_select={props.on_select}
                on_program_select={handle_select_program}
                compiled_programs={compiled_programs}
                breakpoints={breakpoints}
                on_add_breakpoint={handle_add_breakpoint}
                on_remove_breakpoint={handle_remove_breakpoint}
                checkpoint={checkpoint}
            />
        </div>

    );
};

export default HilDebuggerView;
