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
import {TabbedContent, UIPanel} from "../../UI_elements"
import EmulationResults from "./EmulationResults";
import HilPlotTab from "./HilControl/HilPlotTab";
import FcoreEmulatorSidebar from "./Sidebar/FcoreEmulatorSidebar";

let HilView = function (props) {

    let [selected_component, set_selected_component] = useState(null);
    let [selected_iom, set_selected_iom] = useState(null);
    let [selected_tab, set_selected_tab] = useState(0);
    let [emulator_selector, set_selected_emulator] = useState(null);
    let [compiler_warnings, set_compiler_warnings] = useState(null);

    let [hil_plot_running, set_hil_plot_running] = useState(false);
    let [download_data_request, set_download_data_request] = useState(null);


    let [emulation_results, set_emulation_results] = useState({});
    let [input_data, set_input_data] = useState({});
    let [deployed, set_deployed] = useState(false);

    let on_select = (value) =>{
        set_selected_tab(value);
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
        set_selected_emulator(emu);
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
                        input_data={input_data}
                        onDeploy={()=>{set_deployed(true)}}
                        emulator_selector={emulator_selector}
                        on_component_select={handle_component_select}
                        on_iom_select={handle_iom_select}
                        selected_component={selected_component}
                        selected_iom={selected_iom}
                        on_compile_done={set_compiler_warnings}
                    />,
                    <EmulationResults results={emulation_results} inputs={input_data}/>,
                    <HilPlotTab
                        deployed={deployed}
                        emulator_selector={emulator_selector}
                        hil_plot_running={hil_plot_running}
                        download_data_request={download_data_request}
                        on_download_done={set_download_data_request}
                    />
                ]} onSelect={on_select} selected={selected_tab}/>
            </UIPanel>
            <div style={{height:"100%"}}>
                <FcoreEmulatorSidebar
                    selected_component={selected_component}
                    on_select={handle_emulator_select}
                    on_iom_modify={handle_iom_select}
                    emulator_selector={emulator_selector}
                    selected_iom={selected_iom}
                    enable_hil_controls={selected_tab===2}
                    enable_emulator_properties={selected_tab === 0}
                    on_plot_status_update={set_hil_plot_running}
                    hil_plot_running={hil_plot_running}
                    onDownloadHilData={set_download_data_request}
                    compile_warning={compiler_warnings}
                />
            </div>
        </div>

    );
};

export default HilView;
