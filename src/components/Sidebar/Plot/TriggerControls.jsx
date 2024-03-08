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

import {Chip, InputField, Radio, SelectField} from "../../UI_elements";
import {get_acquisition_status, set_acquisition} from "../../../client_core/proxy/plot";
import useInterval from "../../Common_Components/useInterval";
import PlotControls from "../../plot_tab_components/PlotControls";

let  TriggerControls = props =>{

    let [acquisition_mode, set_acquisition_mode] = useState({label:"continuous", value:"continuous"});
    let [trigger_mode, set_trigger_mode] = useState({label:"rising edge", value:"rising_edge"});
    let [acquisition_status, set_acquisition_status] = useState("wait");
    let [trigger_source, set_trigger_source] = useState({label:"1", value:"1"});
    let [trigger_level, set_trigger_level] = useState(0);
    let [trigger_point, set_trigger_point] = useState(200);
    let [tb_prescaler, set_tb_prescaler] = useState(0);

    let [remote_version, set_remote_version] = useState(0);

    let [past_acq_state, set_past_acq_state] = useState({});

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
        let next_acq = {
            level: trigger_level,
            level_type: "int",
            mode: acquisition_mode.value,
            trigger: trigger_mode.value,
            prescaler:tb_prescaler,
            source:parseInt(trigger_source.value),
            trigger_point:trigger_point
        };
        if(past_acq_state !== next_acq){
            set_acquisition(next_acq).then(()=>{
                set_past_acq_state(next_acq);
            });
        }

    }, [remote_version]);



    let handle_set_value = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            switch (event.target.name) {
                case "trigger_level":
                    if(event.target.value.match("^\\d+(\\.\\d+)?")) {
                        set_trigger_level(parseFloat(event.target.value))
                        set_remote_version(remote_version + 1);
                    }
                    break;
                case "trigger_point":
                    if(event.target.value.match("^\\d+")) {
                        set_trigger_point(parseInt(event.target.value))
                        set_remote_version(remote_version + 1);
                    }
                    break;
                case  "tb_prescaler":
                    if(event.target.value.match("^\\d+")) {
                        set_tb_prescaler(parseInt(event.target.value))
                        set_remote_version(remote_version + 1);
                    }
                    break;
            }

        }

    }

    if(props.showAcquisitionStatus){
        useInterval(() => {
            get_acquisition_status().then(resp =>{
                set_acquisition_status(resp);
            })
        },  750);
    }
    let plot_status = () =>{
        if(props.showAcquisitionStatus){
            return <Chip status={acquisition_status} >{acquisition_status}</Chip>
        }
    }
    return(
        <div>
            {plot_status()}
            <InputField
                inline
                ID="trigger_level"
                name='trigger_level'
                defaultValue={trigger_level}
                onKeyDown={handle_set_value}
                label="Trigger Level"
            />
            <InputField
                inline
                ID="trigger_point"
                name='trigger_point'
                defaultValue={trigger_point}
                onKeyDown={handle_set_value}
                label="Trigger point"
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
            <InputField
                inline
                ID="tb_prescaler"
                name='tb_prescaler'
                defaultValue={tb_prescaler}
                onKeyDown={handle_set_value}
                label="Timebase Prescaler"
            />
            <PlotControls onPlay={props.onPlay} onPause={props.onPause} onDownload={props.onDownload} onStop={props.onStop}/>
        </div>

    );
};

export default TriggerControls;
