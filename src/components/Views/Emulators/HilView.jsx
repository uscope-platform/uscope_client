// Copyright 2023 Filippo Savi
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

import {TabbedContent, UIPanel} from "../../UI_elements"
import {up_emulator} from "../../../client_core/index.js";
import {useSelector} from "react-redux";
import HilEditorView from "./Editor/HilEditorView.jsx";
import HilDebuggerView from "./FcoreDebugger/HilDebuggerView.jsx";
import HilControlView from "./HilControl/HilControlView.jsx";
import HilResultsView from "./EmulationResults/HilResultsView.jsx";
import HilSpecsView from "./Specs/HilSpecsView.jsx";

let HilView = function (props) {

    let [selections, set_selections] = useState({
        component:null,
        iom:null,
        tab:0,
        program:null
    })


    let [breakpoints, set_breakpoints] = useState([]);


    let [compiler_warnings, set_compiler_warnings] = useState(null);

    let [hil_plot_running, set_hil_plot_running] = useState(false);
    let [download_data_request, set_download_data_request] = useState(null);

    let [emulation_results, set_emulation_results] = useState({});
    let [input_data, set_input_data] = useState({});
    let [deployed, set_deployed] = useState(false);

    let [compiled_programs, set_compiled_programs] = useState({});

    let[ debugger_data, set_debugger_data] = useState({asm:"", source:""});

    const emulators_store = useSelector(state => state.emulators);
    const programs_store = useSelector(state => state.programs);

    let [emulator, set_emulator] = useState({
        name:"",
        cores:[],
        connections:[],
        _get_emulator: ()=>{
            return{
                name:"",
                cores:[],
                connections:[]
            }
        }
    });


    let on_select = (value) =>{
        set_selections({...selections, tab:value});
    }

    let on_select_program = async (value)=>{
        set_selections({...selections, program: value});
        let program = Object.values(emulator.cores).filter(c =>{
            return c.name === value;
        })[0].program;
        let src = Object.values(programs_store).filter(p =>{
            return p.name === program;
        })[0].content;
        set_debugger_data({asm:compiled_programs[value], source:src});


       let bps= await emulator.get_breakpoints(value);

       set_breakpoints(bps.map(b=>b+1));
    }


    let handle_emulator_select = (emu)=>{

        set_emulator(new up_emulator(emulators_store[emu]));
        set_selections({...selections, component: null});
        set_breakpoints([]);
    }

    let handle_add_breakpoint = async (value) =>{
        let vv = parseInt(value);
        if(vv>0){
            await emulator.add_breakpoint(selections.program, (vv-1));
            set_breakpoints([...breakpoints, (vv)]);
        }
    }

    let handle_remove_breakpoint = async (raw_val) =>{
        await emulator.remove_breakpoint(selections.program, raw_val-1);
        let new_breakpoints = breakpoints.filter(b =>{
            return b !== raw_val;
        });
        set_breakpoints(new_breakpoints);
    }

    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:10,
            height:"100%"
        }}>
              <UIPanel style={{flexGrow:1}} key="emulator_diagram" level="level_2">
                <TabbedContent height="100%" names={["Editor","Debugger","Hardware",  "Results", "Specs"]} contents={[
                    <HilEditorView
                        set_emulation_results={set_emulation_results}
                        set_input_data={set_input_data}
                        input_data={input_data}
                        onDeploy={()=>{set_deployed(true)}}
                        emulator={emulator}
                        selections={selections}
                        set_selections={set_selections}
                        set_compiled_programs={set_compiled_programs}
                        on_compile_done={set_compiler_warnings}
                        on_emulator_select={handle_emulator_select}
                        compiler_warnings={compiler_warnings}
                    />,
                    <HilDebuggerView
                        emulator={emulator}
                        selections={selections}
                        set_selections={set_selections}
                        on_select={handle_emulator_select}
                        on_program_select={on_select_program}
                        compiled_programs={compiled_programs}
                        breakpoints={breakpoints}
                        on_add_breakpoint={handle_add_breakpoint}
                        on_remove_breakpoint={handle_remove_breakpoint}
                        debugger_data={debugger_data}
                        set_emulation_results={set_emulation_results}
                    />,
                    <HilControlView
                        emulator={emulator}
                        deployed={deployed}
                        selections={selections}
                        set_selections={set_selections}
                        on_select={handle_emulator_select}
                        hil_plot_running={hil_plot_running}
                        set_hil_plot_running={set_hil_plot_running}
                        set_download_data_request={set_download_data_request}
                        download_data_request={download_data_request}
                    />,
                    <HilResultsView
                        emulation_results={emulation_results}
                        input_data={input_data}
                    />,
                    <HilSpecsView
                        emulator={emulator}
                        handle_select_emulator={handle_emulator_select}
                    />
                ]} onSelect={on_select} selected={selections.tab}/>
            </UIPanel>
        </div>

    );
};

export default HilView;
