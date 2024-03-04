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


import React, {useEffect, useState} from 'react';

import styled from "styled-components";
import {Chip, InputField, Radio, SelectField} from "../../UI_elements";
import {get_acquisition_status, set_acquisition} from "../../../client_core/proxy/plot";
import useInterval from "../../Common_Components/useInterval";

let  TriggerControls = props =>{

    let [acquisition_mode, set_acquisition_mode] = useState({label:"continuous", value:"continuous"});
    let [trigger_mode, set_trigger_mode] = useState({label:"rising edge", value:"rising_edge"});
    let [acquisition_status, set_acquisition_status] = useState("stopped");
    let [trigger_source, set_trigger_source] = useState({label:"1", value:"1"});
    let [trigger_level, set_trigger_level] = useState(0);
    let [level_type, set_level_type] = useState("float");

    let [remote_version, set_remote_version] = useState(0);

    let handle_select = (value, event) =>{
        switch (event.name) {
            case "trigger_mode":
                set_trigger_mode(value);
                break;
            case "acquisition_mode":
                set_acquisition_mode(value);
                break;
            case "trigger_source":
                set_trigger_source(value)
                break;
        }
        set_remote_version(remote_version + 1);
    }

    useEffect(() => {
        if(remote_version>0){
            set_acquisition({
                level: trigger_level,
                level_type: level_type,
                mode: acquisition_mode.value,
                trigger: trigger_mode.value,
                source:parseInt(trigger_source.value)
            }).then();
        }
    }, [remote_version]);

    let handle_get_status = () =>{
        get_acquisition_status().then(resp =>{
            set_acquisition_status(acquisition_status);
        })
    }

    let handle_set_value = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let lvl = event.target.value;
            if(lvl.match("^\\d+(\\.\\d+)?")) {
                set_trigger_level(parseFloat(lvl))
                set_remote_version(remote_version + 1);
            }
        }

    }


    useInterval(() => {
        handle_get_status();
    },  props.refreshRate);

    return(
        <div>
            <Chip status={acquisition_status} >{acquisition_status}</Chip>
            <InputField
                inline
                ID="trigger_level"
                name='trigger_level'
                defaultValue={trigger_level}
                onKeyDown={handle_set_value}
                label="Trigger Level"
            />
            <Radio
                label="Level Type"
                value={level_type}
                options={['float', 'int']}
                onChange={(value) =>{
                    set_level_type(value);
                    set_remote_version(remote_version + 1);
                }}
            />
            <SelectField
                inline
                label="Acquisition mode"
                onChange={handle_select}
                value={acquisition_mode}
                name="acquisition_mode"
                options={[
                    {label:"continuous", value:"continuous"},
                    {label:"single", value:"single"},
                    {label:"free_running", value:"free_running"}
                ]}
            />
            <SelectField
                inline
                label="Trigger Source"
                onChange={handle_select}
                value={trigger_source}
                name="trigger_source"
                options={[
                    {label:"1", value:"1"},
                    {label:"2", value:"2"},
                    {label:"3", value:"3"},
                    {label:"4", value:"4"},
                    {label:"5", value:"5"},
                    {label:"6", value:"6"},
                ]}
            />
            <SelectField
                inline
                label="Trigger mode"
                onChange={handle_select}
                value={trigger_mode}
                name="trigger_mode"
                options={[
                    {label:"rising edge", value:"rising_edge"},
                    {label:"falling edge", value:"falling_edge"},
                    {label:"both edges", value:"both_edges"}
                ]}
            />
        </div>

    );
};

export default TriggerControls;
