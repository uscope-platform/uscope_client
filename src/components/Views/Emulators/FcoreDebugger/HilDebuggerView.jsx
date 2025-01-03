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

import React, {useState} from 'react';
import FcoreDebugger from "./FcoreDebugger.jsx";
import HilDebuggerSidebar from "../Sidebar/per_panel_sidebars/HilDebuggerSidebar.jsx";
import {useSelector} from "react-redux";

let HilDebuggerView = function (props) {


    let[ debugger_data, set_debugger_data] = useState({asm:"", source:""});
    const programs_store = useSelector(state => state.programs);

    let [breakpoints, set_breakpoints] = useState([]);

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

        set_debugger_data({asm:props.compiled_programs[value], source:src});


        let bps= await props.emulator.get_breakpoints(value);

        set_breakpoints(bps.map(b=>b+1));
    }


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
                translation_table={debugger_data.asm.translation_table}
                content={debugger_data}
                on_emulation_end={props.set_emulation_results}
            />
            <HilDebuggerSidebar
                emulator={props.emulator}
                selections={props.selections}
                on_selection={props.set_selections}
                on_select={props.on_select}
                on_program_select={handle_select_program}
                compiled_programs={props.compiled_programs}
                breakpoints={breakpoints}
                on_add_breakpoint={handle_add_breakpoint}
                on_remove_breakpoint={handle_remove_breakpoint}
            />
        </div>

    );
};

export default HilDebuggerView;
