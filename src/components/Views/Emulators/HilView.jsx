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

import {TabbedContent, UIPanel} from "@UI"
import {up_emulator} from "@client_core";
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


    let [emulation_results, set_emulation_results] = useState({});
    let [input_data, set_input_data] = useState({});
    let [deployed, set_deployed] = useState(false);

    let [compiled_programs, set_compiled_programs] = useState({});

    const emulators_store = useSelector(state => state.emulators);

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


    let handle_emulator_select = (emu)=>{
        set_emulator(new up_emulator(emulators_store[emu]));
        set_selections({...selections, component: null});
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
                        on_emulator_select={handle_emulator_select}
                    />,
                    <HilDebuggerView
                        emulator={emulator}
                        selections={selections}
                        set_selections={set_selections}
                        on_select={handle_emulator_select}
                        compiled_programs={compiled_programs}
                        set_emulation_results={set_emulation_results}
                    />,
                    <HilControlView
                        emulator={emulator}
                        deployed={deployed}
                        selections={selections}
                        set_selections={set_selections}
                        on_select={handle_emulator_select}
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
