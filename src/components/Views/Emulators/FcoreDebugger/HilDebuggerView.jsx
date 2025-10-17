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

let HilDebuggerView = function (props) {


    let[ debugger_data, set_debugger_data] = useState({
        asm:{
            translation_table:[],
            common_io_translation_table:[],
            program:""
        },
        source:""
    });

    let [checkpoint, set_checkpoint] = useState({
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

    let [breakpoints, set_breakpoints] = useState([]);

    let [compiled_programs, set_compiled_programs] = useState({});

    const programs_store = useAppSelector(state => state.programs);


    let handle_add_breakpoint = async (value) =>{
        let vv = parseInt(value);
        if(vv>0){
            await props.emulator.add_breakpoint(props.selections.program, (vv-1));
            set_breakpoints([...breakpoints, (vv)]);
        }
    }

    let handle_remove_breakpoint = async (raw_val) =>{
        await props.emulator.remove_breakpoint(props.selections.program, raw_val-1);
        let new_breakpoints = breakpoints.filter(b =>{
            return b !== raw_val;
        });
        set_breakpoints(new_breakpoints);
    }


    let handle_select_program = async (value)=>{
        props.set_selections({...props.selections, program: value});

        let program = Object.values(props.emulator.cores).filter(c =>{
            return c.name === value;
        })[0].program;
        let src = Object.values(programs_store).filter(p =>{
            return p.name === program;
        })[0].content;

        set_debugger_data({asm:compiled_programs[value], source:src});

        let bps= await props.emulator.get_breakpoints(value);

        set_breakpoints(bps.map(b=>b+1));
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
                on_selection={props.set_selections}
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
