// Copyright 2024 Filippo Savi
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

import React from 'react';
import {InputField, SimpleContent, UIPanel} from "../UI_elements";
import {useSelector} from "react-redux";
import {up_application} from "../../client_core";

let SettingsView = function (props) {

    const empty_app = {
        channels:[],
        channel_groups:[],
        initial_registers_values:[],
        macro:[],
        parameters:[],
        peripherals:[],
        soft_cores:[],
        filters:[],
        scripts:[],
        programs:[],
        application_name:""
    };


    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications);

    const selected_app = settings.selected_application ?applications[settings.selected_application]: {};

    const hil_present = selected_app.application_name === "HIL_base";

    let handle_edit_clocks = async (event) =>{

        if(event.key==="Enter"|| event.key ==="Tab"){
            let app = new up_application(selected_app);
            await app.edit_clock_frequency(event.target.name.replace("fclk_", ""), parseFloat(event.target.value))
            props.forceUpdate();
        }
    }

    let handle_edit_platform_settings = (event) =>{
        let i= 0;
    }

    let render_hil_components = () =>{
        if(hil_present){
            return(
                <UIPanel key="hil_settings" style={{minHeight:"100px"}} level="level_2">
                    <SimpleContent name="hil_settings" content={
                        <div>
                        </div>
                    }/>
                </UIPanel>
            )
        } else {
            return null;
        }
    }

    return(
        <div style={{
            display:"flex",
            flexDirection:"column",
            gap:10,
            margin:10
        }}>
            <UIPanel key="clock_settings" style={{minHeight:"100px"}} level="level_2">
                <SimpleContent name="PL Clocks" content={
                    <div>
                        <InputField inline name="fclk_0" defaultValue={selected_app.pl_clocks["0"]} onKeyDown={handle_edit_clocks} label="PL clock frequency 0"/>
                        <InputField inline name="fclk_1" defaultValue={selected_app.pl_clocks["1"]} onKeyDown={handle_edit_clocks} label="PL clock frequency 1"/>
                        <InputField inline name="fclk_2" defaultValue={selected_app.pl_clocks["2"]} onKeyDown={handle_edit_clocks} label="PL clock frequency 2"/>
                        <InputField inline name="fclk_3" defaultValue={selected_app.pl_clocks["3"]} onKeyDown={handle_edit_clocks} label="PL clock frequency 3"/>
                    </div>
                }/>
            </UIPanel>
            <UIPanel key="platform_settings" style={{minHeight:"100px"}} level="level_2">
                <SimpleContent name="Platform settings" content={
                    <div>
                        <InputField inline name="driver_log_level" defaultValue={123} onKeyDown={handle_edit_platform_settings} label="Driver log level"/>
                    </div>
                }/>
            </UIPanel>
            {render_hil_components()}
        </div>
    );
};

export default SettingsView;
