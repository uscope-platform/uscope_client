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
import {ColorTheme, TabbedContent, UIPanel} from "../../UI_elements"
import EmulationResults from "./EmulationResults";
import HilPlotTab from "./HilControl/HilPlotTab";
import FcoreEmulatorSidebar from "./Sidebar/FcoreEmulatorSidebar";
import {json} from "@codemirror/lang-json";
import TextEditor from "../../UI_elements/TextEditor.jsx";
import {MdSave} from "react-icons/md";
import {download_json, up_emulator} from "../../../client_core/index.js";
import {useSelector} from "react-redux";
import FcoreDebugger from "./FcoreDebugger/FcoreDebugger.jsx";

let HilView = function (props) {

    let [selected_component, set_selected_component] = useState(null);
    let [selected_iom, set_selected_iom] = useState(null);
    let [selected_tab, set_selected_tab] = useState(0);
    let [selected_program, set_selected_program] = useState(null);
    let [compiler_warnings, set_compiler_warnings] = useState(null);

    let [hil_plot_running, set_hil_plot_running] = useState(false);
    let [download_data_request, set_download_data_request] = useState(null);

    let [emulation_results, set_emulation_results] = useState({});
    let [input_data, set_input_data] = useState({});
    let [deployed, set_deployed] = useState(false);

    let [compiled_programs, set_compiled_programs] = useState({});
    let [hil_json, set_hil_json] = useState(null);

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
        set_selected_tab(value);
    }

    let on_select_program = (value)=>{
        set_selected_program(value);
        let program = Object.values(emulator.cores).filter(c =>{
            return c.name === value;
        })[0].program;
        let src = Object.values(programs_store).filter(p =>{
            return p.name === program;
        })[0].content;
        set_debugger_data({asm:compiled_programs[value], source:src});
    }

    let handle_component_select = (value) => {
        set_selected_component(value);
        set_selected_iom(null);
    }

    let handle_iom_select = (value)=>{
        set_selected_iom(value);
    }

    let handle_emulator_select = (emu)=>{
        set_emulator(new up_emulator(emulators_store[emu]));
        set_selected_component(null);
    }

    let handle_download_json = ()=>{
        download_json(hil_json, emulator.name + "_artifact");
    }



    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:10,
            height:"100%"
        }}>
            <UIPanel style={{flexGrow:1}} key="emulator_diagram" level="level_2">
                <TabbedContent height="100%" names={["Emulation setup", "Emulation Results", "Hil Scope", "Asm viewer", "HIL Spec Viewer"]} contents={[
                    <FcoreEmulationEditor
                        onEmulationDone={set_emulation_results}
                        onInputDataChange={set_input_data}
                        input_data={input_data}
                        onDeploy={()=>{set_deployed(true)}}
                        emulator={emulator}
                        on_component_select={handle_component_select}
                        on_iom_select={handle_iom_select}
                        on_tab_change={on_select}
                        selected_component={selected_component}
                        selected_iom={selected_iom}
                        on_show_disassembly={set_compiled_programs}
                        on_show_json={set_hil_json}
                        on_compile_done={set_compiler_warnings}
                    />,
                    <EmulationResults results={emulation_results} inputs={input_data}/>,
                    <HilPlotTab
                        deployed={deployed}
                        emulator={emulator}
                        hil_plot_running={hil_plot_running}
                        download_data_request={download_data_request}
                        on_download_done={set_download_data_request}
                    />,
                    <FcoreDebugger
                        content={debugger_data}
                    />,
                    <div>

                        <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
                            <MdSave onClick={handle_download_json} size={ColorTheme.icons_size}/>
                        </div>
                            <TextEditor
                                tab_name="HIL spec Viewer"
                                content={hil_json}
                                extensions={[json()]}
                            />
                        </div>
                ]} onSelect={on_select} selected={selected_tab}/>
            </UIPanel>
            <div style={{height: "100%"}}>
                <FcoreEmulatorSidebar
                    selected_component={selected_component}
                    on_select={handle_emulator_select}
                    on_iom_modify={handle_iom_select}
                    emulator={emulator}
                    selected_iom={selected_iom}
                    selected_tab={selected_tab}
                    on_plot_status_update={set_hil_plot_running}
                    hil_plot_running={hil_plot_running}
                    onDownloadHilData={set_download_data_request}
                    compile_warning={compiler_warnings}
                    compiled_programs={compiled_programs}
                    selected_program={selected_program}
                    on_program_select={on_select_program}
                />
            </div>
        </div>

    );
};

export default HilView;
