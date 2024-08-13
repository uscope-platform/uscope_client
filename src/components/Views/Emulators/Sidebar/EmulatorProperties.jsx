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

import React, {useEffect, useReducer, useState} from 'react';

import {InputField, SimpleContent, UIPanel, RangedInputField, Checkbox} from "../../../UI_elements";


const ranges_map = {s:1, ms:1e-3, us:1e-6};

let get_range = (time) =>{
    if(time){
        let new_range;
        let new_indicated_time;
        if(time>= 1){
            new_range = "s";
            new_indicated_time = time;
        } else if(time>=1e-3){
            new_range = "ms";
            new_indicated_time = time/ranges_map.ms;
        } else {
            new_range = "us";
            new_indicated_time = time/ranges_map.us;
        }
        return [new_range, new_indicated_time];
    }
    return [null, null]
}


let  EmulatorProperties = props =>{

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [range, set_range] = useState("s");
    const [indicated_time, set_indicated_time] = useState(0);
    const emulation_time = props.selected_emulator && props.selected_emulator.emulation_time ? props.selected_emulator.emulation_time : 0;


    useEffect(() => {
        if(emulation_time){
            let [new_range, new_indicated_time] = get_range(emulation_time)
            if(new_range){
                set_range(new_range);
                set_indicated_time(new_indicated_time);
            }
        }

    }, [emulation_time]);


    let handle_change = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            if (event.target.name === "name"){
                props.selected_emulator.edit_name(event.target.value).then(() => {
                    forceUpdate();
                });
            } else if(event.target.name === "emulation_time"){
                set_indicated_time(event.target.value);
                let time = parseFloat(event.target.value)*ranges_map[range];
                props.selected_emulator.edit_emulation_time(time).then(()=>{
                    forceUpdate();
                });
            }
        }
    }

    const handle_range_change = (value)=>{
        let time = indicated_time*ranges_map[value];
        props.selected_emulator.edit_emulation_time(time).then(()=>{
            forceUpdate();
        });
    }
    const handle_deployment_mode = (event) =>{
        props.selected_emulator.edit_deployment_mode(event.target.checked);
    }

    if(props.selected_emulator && props.enabled){
        return(
            <UIPanel style={{margin:10}} key={"Item properties"} level="level_2">
                {
                    <SimpleContent name={"Emulator Properties"} content={
                        <div style={{padding:10}} key="emulator_props">
                            <InputField inline id="name" name="name" label="Emulator Name" defaultValue={props.selected_emulator.name} onKeyDown={handle_change}/>

                            <RangedInputField
                                ID="emulation_time"
                                name="emulation_time"
                                label="Emulation Time"
                                rangeOptions={["us", "ms", "s"]}
                                onKeyDown={handle_change}
                                onRangeChange={handle_range_change}
                                value={indicated_time}
                                range={range}
                            />
                            <Checkbox name='deployment_mode' value={props.selected_emulator.deployment_mode} onChange={handle_deployment_mode} label="Custom deployment mode"/>
                        </div>
                    }
                    />
                }
            </UIPanel>
        );
    }

};

export default EmulatorProperties;
