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


import React, {useState} from 'react';

import styled from "styled-components";
import {Chip, SelectField} from "../../UI_elements";
import {get_acquisition_status, set_acquisition} from "../../../client_core/proxy/plot";
import useInterval from "../../Common_Components/useInterval";

const ComponentStyle = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`

let  TriggerControls = props =>{

    let [acquisition_mode, set_acquisition_mode] = useState({label:"continuous", value:"continuous"});
    let [trigger_mode, set_trigger_mode] = useState({label:"rising edge", value:"rising_edge"});
    let [acquisition_status, set_acquisition_status] = useState("stopped");

    let handle_select = (value, event) =>{
        if(event.name==="trigger_mode"){
            set_trigger_mode(value);
        } else if(event.name === "acquisition_mode"){
            set_acquisition_mode(value);
        }
        set_acquisition({mode: acquisition_mode.value, trigger: trigger_mode.value}).then();
    }


    let handle_get_status = () =>{
        get_acquisition_status().then(resp =>{
            set_acquisition_status(acquisition_status);
        })
    }

    useInterval(() => {
        handle_get_status();
    },  props.refreshRate);

    return(
        <div>
            <SelectField
                inline
                label="Acquisition mode"
                onChange={handle_select}
                value={acquisition_mode}
                defaultValue="Select Acquisition mode"
                name="acquisition_mode"
                options={[
                    {label:"continuous", value:"continuous"},
                    {label:"single", value:"single"},
                    {label:"free_running", value:"free_running"}
                ]}
            />
            <SelectField
                inline
                label="Trigger mode"
                onChange={handle_select}
                value={trigger_mode}
                defaultValue="Select Trigger mode"
                name="trigger_mode"
                options={[
                    {label:"rising edge", value:"rising_edge"},
                    {label:"falling edge", value:"falling_edge"},
                    {label:"both edges", value:"both_edges"}
                ]}
            />
            <Chip status={"running"} >STATUS</Chip>
        </div>

    );
};

export default TriggerControls;
