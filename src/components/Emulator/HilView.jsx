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

let HilView = function (props) {

    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();

    let [emulation_results, set_emulation_results] = useState({});
    let [input_data, set_input_data] = useState({});
    let [deployed, set_deployed] = useState(false);

    let on_select = (value) =>{
        dispatch(setSetting(["emulator_selected_tab", value]))
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
                    <FcoreEmulationEditor onEmulationDone={set_emulation_results} onInputDataChange={set_input_data} onDeploy={()=>{set_deployed(true)}}/>,
                    <EmulationResults results={emulation_results} inputs={input_data}/>,
                    <HilPlotTab deployed={deployed}/>
                ]} onSelect={on_select} selected={settings.emulator_selected_tab}/>
            </UIPanel>
            <div style={{height:"100%"}}>
                <FcoreEmulatorSidebar/>
            </div>
        </div>

    );
};

export default HilView;
