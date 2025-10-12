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
import {up_emulator, up_emulator_result} from "#client_core";
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
        program:null,
        obj_version:0
    })


    let [emulation_results, set_emulation_results] = useState(up_emulator_result.getDummy());
    let [input_data, set_input_data] = useState({});
    let [deployed, set_deployed] = useState(false);


    const emulators_store = useSelector(state => state.emulators);

    let [emulator, set_emulator] = useState(up_emulator.get_dummy());


    let versioned_handle_selection = (value) =>{
        let new_val = {...value, obj_version: value.obj_version + 1}
        set_selections(new_val);
    }


    let on_item_select = (value) =>{
        versioned_handle_selection({...selections, tab:value});
    }


    let handle_emulator_select = (emu)=>{
        set_emulator(new up_emulator(emulators_store[emu]));
        versioned_handle_selection({...selections, component: null});
    }


    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:10,
            height:"100%"
        }}>
              <UIPanel style={{flexGrow:1}} key="emulator_diagram" level="level_2">
                  <TabbedContent height="100%" names={["Editor","Debugger","Hardware",  "Results", "Specs"]} onSelect={on_item_select} selected={selections.tab}>
                      <HilEditorView
                          set_emulation_results={set_emulation_results}
                          set_input_data={set_input_data}
                          input_data={input_data}
                          bump_version={()=>{versioned_handle_selection(selections)}}
                          onDeploy={()=>{set_deployed(true)}}
                          emulator={emulator}
                          selections={selections}
                          set_selections={versioned_handle_selection}
                          on_emulator_select={handle_emulator_select}
                          on_compile_done={()=>{}}
                      />
                      <HilDebuggerView
                          emulator={emulator}
                          selections={selections}
                          set_selections={versioned_handle_selection}
                          on_select={handle_emulator_select}
                          set_emulation_results={set_emulation_results}
                      />
                      <HilControlView
                          emulator={emulator}
                          deployed={deployed}
                          selections={selections}
                          set_selections={versioned_handle_selection}
                          on_select={handle_emulator_select}
                      />
                      <HilResultsView
                          filename={emulator.name}
                          emulation_results={emulation_results}
                          input_data={input_data}
                      />
                      <HilSpecsView
                          emulator={emulator}
                          handle_select_emulator={handle_emulator_select}
                      />
                  </TabbedContent>
            </UIPanel>
        </div>

    );
};

export default HilView;
