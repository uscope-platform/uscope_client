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

import FcoreEmulationEditor from "./FcoreEmulationEditor";
import {TabbedContent, UIPanel} from "../UI_elements"
import EmulationResults from "./EmulationResults";
import HilPlotTab from "./HilControl/HilPlotTab";
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../../redux/Actions/SettingsActions";
import FcoreEmulatorSidebar from "../Sidebar/FcoreEmulator/FcoreEmulatorSidebar";
import {up_emulator} from "../../client_core";

let HilView = function (props) {


    const emulators_store = useSelector(state => state.emulators);
    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();

    let [selected_component, set_selected_component] = useState(null);
    let [selected_iom, set_selected_iom] = useState(null);

    let [selected_emulator, set_selected_emulator] = useState({
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

    let [emulation_results, set_emulation_results] = useState({});
    let [input_data, set_input_data] = useState({});
    let [deployed, set_deployed] = useState(false);

    let on_select = (value) =>{
        dispatch(setSetting(["emulator_selected_tab", value]))
    }

    let handle_component_select = (value) => {
        set_selected_component(value);
        set_selected_iom(null);
    }

    let handle_iom_select = (value)=>{
        set_selected_iom(value);
    }

    let handle_emulator_select = (emu)=>{
        // THE DEEP COPY IS NECESSARY BECAUSE REACT IS STUPID
        set_selected_emulator(new up_emulator(emulators_store[emu].deep_copy()));
        set_selected_component(null);
    }

    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:10,
            height:"100%"
        }}>
            <UIPanel style={{flexGrow:1}} key="emulator_diagram" level="level_2">
                <TabbedContent height="100%" names={["Emulation setup", "Emulation Results", "Hil Scope"]} contents={[
                    <FcoreEmulationEditor
                        onEmulationDone={set_emulation_results}
                        onInputDataChange={set_input_data}
                        onDeploy={()=>{set_deployed(true)}}
                        emulator={selected_emulator}
                        on_component_select={handle_component_select}
                        on_iom_select={handle_iom_select}
                        selected_component={selected_component}
                        selected_iom={selected_iom}
                    />,
                    <EmulationResults results={emulation_results} inputs={input_data}/>,
                    <HilPlotTab deployed={deployed}  emulator={selected_emulator} />
                ]} onSelect={on_select} selected={settings.emulator_selected_tab}/>
            </UIPanel>
            <div style={{height:"100%"}}>
                <FcoreEmulatorSidebar
                    selected_component={selected_component}
                    on_select={handle_emulator_select}
                    on_iom_modify={handle_iom_select}
                    emulator={selected_emulator}
                    selected_iom={selected_iom}
                />
            </div>
        </div>

    );
};

export default HilView;
