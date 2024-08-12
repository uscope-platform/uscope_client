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

import React, {useContext, useEffect, useState} from 'react';
import {InputField, SelectField, SimpleContent, UIPanel} from "../../UI_elements";
import {ApplicationContext} from "../../../AuthApp";
import {up_settings} from "../../../client_core/data_models/up_settings";

let SettingsView = function (props) {

    const application = useContext(ApplicationContext);


    const selected_app = application ? application: {};

    const hil_present = selected_app.application_name === "HIL_base";

    const [debug_level, set_debug_level] = useState({label:"", value:""});
    const [hil_address_map, set_hil_address_map] = useState({
        "bases": {
            "cores_rom": 0,
            "cores_control": 0,
            "cores_inputs": 0,
            "controller": 0,
            "dma": 0,
            "hil_control": 0,
            "scope_mux": 0
        },
        "offsets": {
            "cores_rom": 0,
            "cores_control": 0,
            "cores_inputs": 0,
            "controller": 0,
            "dma": 0,
            "hil_tb": 0
        }
    });

    useEffect(()=> {
        up_settings.get_debug_level().then(resp=>{
            set_debug_level({label:resp, value:resp});
        })
        up_settings.get_hil_address_map().then(resp=>{
            set_hil_address_map(resp);
        })
    },[])

    let handle_edit_clocks = async (event) =>{

        if(event.key==="Enter"|| event.key ==="Tab"){
            await application.edit_clock_frequency(event.target.name.replace("fclk_", ""), parseFloat(event.target.value))
            props.forceUpdate();
        }
    }

    let handle_set_debug_level =async (value, event) =>{
        await up_settings.set_debug_level(value.value);
        set_debug_level(value);
    }

    let handle_edit_hil_setting = async (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let tok = event.target.name.split(".");
            let new_map = hil_address_map;
            new_map[tok[1]][tok[0]]= parseInt(event.target.value, 0);
            set_hil_address_map(new_map);
            await up_settings.set_hil_address_map(new_map);
        }
    }

    let render_hil_components = () =>{
        const div_style = {
            display:"flex",
            flexDirection:"row",
            gap:10
        };

        if(hil_present){
            return(
                <UIPanel key="hil_settings" style={{minHeight:"100px"}} level="level_2">
                    <SimpleContent name="hil_settings" content={
                        <div>
                            <div style={div_style}>
                                <InputField inline name="cores_rom.bases" defaultValue={'0x'+hil_address_map.bases.cores_rom.toString(16)}
                                            onKeyDown={handle_edit_hil_setting} label="Cores ROM: base"/>
                                <InputField inline name="cores_rom.offsets"
                                            defaultValue={'0x'+hil_address_map.offsets.cores_rom.toString(16)}
                                            onKeyDown={handle_edit_hil_setting} label="Offset"/>
                            </div>
                            <div style={div_style}>
                                <InputField inline name="cores_control.bases"
                                            defaultValue={'0x'+hil_address_map.bases.cores_control.toString(16)}
                                            onKeyDown={handle_edit_hil_setting} label="Cores Control: base"/>
                                <InputField inline name="cores_control.offsets"
                                            defaultValue={'0x'+hil_address_map.offsets.cores_control.toString(16)}
                                            onKeyDown={handle_edit_hil_setting} label="Offset"/>
                            </div>
                            <div style={div_style}>
                                <InputField inline name="cores_inputs.bases"
                                            defaultValue={'0x'+hil_address_map.bases.cores_inputs.toString(16)}
                                            onKeyDown={handle_edit_hil_setting} label="Cores Inputs: base"/>
                                <InputField inline name="cores_inputs.offsets"
                                            defaultValue={'0x'+hil_address_map.offsets.cores_inputs.toString(16)}
                                            onKeyDown={handle_edit_hil_setting} label="Offset"/>
                            </div>
                            <div style={div_style}>
                                <InputField inline name="controller.bases"
                                            defaultValue={'0x'+hil_address_map.bases.controller.toString(16)}
                                            onKeyDown={handle_edit_hil_setting} label="Controller: base"/>
                                <InputField inline name="controller.offsets"
                                            defaultValue={'0x'+hil_address_map.offsets.controller.toString(16)}
                                            onKeyDown={handle_edit_hil_setting} label="Offset"/>
                            </div>
                            <div style={div_style}>
                                <InputField inline name="dma.bases"
                                            defaultValue={'0x'+hil_address_map.bases.dma.toString(16)}
                                            onKeyDown={handle_edit_hil_setting} label="DMA: base"/>
                                <InputField inline name="dma.offsets"
                                            defaultValue={'0x'+hil_address_map.offsets.dma.toString(16)}
                                            onKeyDown={handle_edit_hil_setting} label="Offset"/>
                            </div>
                            <InputField inline name="hil_control.bases"
                                        defaultValue={'0x'+hil_address_map.bases.hil_control.toString(16)}
                                        onKeyDown={handle_edit_hil_setting} label="HIL control Address"/>
                            <InputField inline name="scope_mux.bases"
                                        defaultValue={'0x'+hil_address_map.bases.scope_mux.toString(16)}
                                        onKeyDown={handle_edit_hil_setting} label="Scope Mux Address"/>
                            <InputField inline name="hil_tb.bases"
                                        defaultValue={'0x'+hil_address_map.offsets.hil_tb.toString(16)}
                                        onKeyDown={handle_edit_hil_setting} label="HIL Timebase Offset"/>
                        </div>
                    }/>
                </UIPanel>
            )
        } else {
            return null;
        }
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            margin: 10
        }}>
            <UIPanel key="clock_settings" style={{minHeight: "100px"}} level="level_2">
                <SimpleContent name="PL Clocks" content={
                    <div>
                        <InputField inline name="fclk_0" defaultValue={selected_app.pl_clocks["0"]}
                                    onKeyDown={handle_edit_clocks} label="PL clock frequency 0"/>
                        <InputField inline name="fclk_1" defaultValue={selected_app.pl_clocks["1"]} onKeyDown={handle_edit_clocks} label="PL clock frequency 1"/>
                        <InputField inline name="fclk_2" defaultValue={selected_app.pl_clocks["2"]} onKeyDown={handle_edit_clocks} label="PL clock frequency 2"/>
                        <InputField inline name="fclk_3" defaultValue={selected_app.pl_clocks["3"]} onKeyDown={handle_edit_clocks} label="PL clock frequency 3"/>
                    </div>
                }/>
            </UIPanel>
            <UIPanel key="platform_settings" style={{minHeight:"100px"}} level="level_2">
                <SimpleContent name="Platform settings" content={
                    <div>
                        <SelectField
                            inline
                            label="Driver Log Level"
                            onChange={handle_set_debug_level}
                            value={debug_level}
                            defaultValue="Select Datapoint"
                            name="driver_log_level"
                            options={[
                                {label:"minimal", value:"minimal"},
                                {label:"debug", value:"debug"},
                                {label:"trace", value:"trace"}
                            ]}
                        />
                    </div>
                }/>
            </UIPanel>
            {render_hil_components()}
        </div>
    );
};

export default SettingsView;
