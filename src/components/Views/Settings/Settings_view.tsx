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
import {FormLayout, InputField, SelectField, SimpleContent, UIPanel} from "#UI/index.js";
import {ApplicationContext} from "#src/AuthApp.jsx";
import ThemeSelector from "../../Common_Components/ThemeSelector.js";
import {up_application, up_settings} from "#client_core/index.js";
import type {SimpleStringOption} from "#interfaces/index.js";

interface SettingsViewProps {
}

type HilMap = {bases: Record<string, number>, offsets: Record<string, number>};

// the fields of the HIL address map: [kind in the map, name in the map, label]
const HIL_FIELDS: [keyof HilMap, string, string][] = [
    ["bases", "cores_rom", "Cores ROM base"],
    ["offsets", "cores_rom", "Cores ROM offset"],
    ["bases", "cores_control", "Cores control base"],
    ["offsets", "cores_control", "Cores control offset"],
    ["bases", "cores_inputs", "Cores inputs base"],
    ["offsets", "cores_inputs", "Cores inputs offset"],
    ["bases", "controller", "Controller base"],
    ["offsets", "controller", "Controller offset"],
    ["offsets", "dma", "DMA offset"],
    ["bases", "hil_control", "HIL control address"],
    ["bases", "scope_mux", "Scope mux address"],
    ["offsets", "hil_tb", "HIL timebase offset"],
];

const COLUMN_WIDTH = "14rem";

let SettingsView = function (props: SettingsViewProps) {

    const application: up_application = useContext(ApplicationContext);

    const hil_present = application.application_name === "HIL_base";

    const [multichannel_debug, set_multichannel_debug] = useState({label:"false", value:"false"});
    const [debug_level, set_debug_level] = useState({label:"", value:""});
    const [hil_address_map, set_hil_address_map] = useState<HilMap>({
        "bases": {
            "cores_rom": 0,
            "cores_control": 0,
            "cores_inputs": 0,
            "controller": 0,
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
        up_settings.get_debugger_option("multichannel_debug").then(resp=>{
            set_multichannel_debug({label:String(resp), value:resp});
        })

    },[])

    let handle_edit_clocks = async (event: React.KeyboardEvent<HTMLInputElement>) =>{

        if(event.key==="Enter"|| event.key ==="Tab"){
            let selected_clock = parseInt(event.currentTarget.name.replace("fclk_", ""));
            await application.edit_clock_frequency(selected_clock, parseFloat(event.currentTarget.value))
        }
    }

    let handle_set_debug_level =async (value:  SimpleStringOption | null) =>{
        if(value===null) return;
        await up_settings.set_debug_level(value.value);
        set_debug_level(value);
    }

    let handle_multichannel_debug =async (value: SimpleStringOption | null) =>{
        if(value===null) return;
        await up_settings.set_debugger_option("multichannel_debug", value.value=== "true");
        set_multichannel_debug(value);
    }

    let handle_edit_hil_setting = async (event: any) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            // the name is "<name>.<kind>"
            let [name, kind] = event.target.name.split(".");
            let new_map: any = hil_address_map;
            new_map[kind][name]= parseInt(event.target.value, 0);
            set_hil_address_map(new_map);
            await up_settings.set_hil_address_map(new_map);
        }
    }

    let render_hil_components = () =>{
        if(!hil_present) return null;
        return(
            <UIPanel key="hil_settings" level="level_2" style={{flexShrink: 0}}>
                <SimpleContent name="HIL Settings">
                    <FormLayout columns={COLUMN_WIDTH}>
                        {HIL_FIELDS.map(([kind, name, label]) => (
                            <InputField key={name + "." + kind} id={name + "." + kind} name={name + "." + kind}
                                        defaultValue={'0x' + hil_address_map[kind]![name]!.toString(16)}
                                        onKeyDown={handle_edit_hil_setting} label={label}/>
                        ))}
                    </FormLayout>
                </SimpleContent>
            </UIPanel>
        )
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
            maxWidth: "60rem",
            margin: "0 auto",
            padding: "1rem",
            // the main area has a fixed height, this page scrolls inside of it
            flex: 1,
            minHeight: 0,
            overflowY: "auto"
        }}>
            <UIPanel key="appearance_settings" level="level_2" style={{flexShrink: 0}}>
                <SimpleContent name="Appearance">
                    <FormLayout>
                        <ThemeSelector/>
                    </FormLayout>
                </SimpleContent>
            </UIPanel>
            <UIPanel key="clock_settings" level="level_2" style={{flexShrink: 0}}>
                <SimpleContent name="PL Clocks">
                    <FormLayout columns={COLUMN_WIDTH}>
                        {["0", "1", "2", "3"].map(i => (
                            <InputField key={i} id={"fclk_" + i} name={"fclk_" + i}
                                        defaultValue={application.pl_clocks[i]!.toString()}
                                        onKeyDown={handle_edit_clocks} label={"PL clock frequency " + i}
                                        description="Press Enter to apply"/>
                        ))}
                    </FormLayout>
                </SimpleContent>
            </UIPanel>
            <UIPanel key="platform_settings" level="level_2" style={{flexShrink: 0}}>
                <SimpleContent name="Platform settings">
                    <FormLayout columns={COLUMN_WIDTH}>
                        <SelectField<SimpleStringOption>
                            label="Driver Log Level"
                            onChange={handle_set_debug_level}
                            value={debug_level}
                            name="driver_log_level"
                            options={[
                                {label:"minimal", value:"minimal"},
                                {label:"debug", value:"debug"},
                                {label:"trace", value:"trace"}
                            ]}
                        />
                        <SelectField<SimpleStringOption>
                            label="Multichannel debug"
                            onChange={handle_multichannel_debug}
                            value={multichannel_debug}
                            name="multichannel_debug"
                            options={[
                                {label:"true", value:"true"},
                                {label:"false", value:"false"}
                            ]}
                        />
                    </FormLayout>
                </SimpleContent>
            </UIPanel>
            {render_hil_components()}
        </div>
    );
};

export default SettingsView;
