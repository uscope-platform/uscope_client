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

import {Chip, InputField, SelectField} from "../../UI_elements";
import {set_acquisition} from "../../../client_core/proxy/plot";
import PlotControls from "../../plot_tab_components/PlotControls";
import {get_ui_state, save_ui_state} from "../../../client_core";
import {ApplicationContext} from "../../../AuthApp";

let  TriggerControls = props =>{

    const application = useContext(ApplicationContext);

    let [controls_state, set_controls_state] = useState(get_ui_state(application,'trigger_and_acquisition',  {
        acquisition_mode: {label:"continuous", value:"continuous"},
        trigger_mode:{label:"rising edge", value:"rising_edge"},
        trigger_source:{label:"1", value:"1"},
        trigger_level:0,
        trigger_point:200,
        tb_prescaler:0,
    }))

    let update_control_state = (state) =>{
        set_controls_state(state);
        save_ui_state(application,'trigger_and_acquisition', state);
    }

    let [remote_version, set_remote_version] = useState(0);

    let [past_acq_state, set_past_acq_state] = useState({});

    let handle_select = (value, event) =>{
        switch (event.name) {
            case "trigger_mode":
                update_control_state({...controls_state, trigger_mode: value});
                break;
            case "acquisition_mode":
                update_control_state({...controls_state, acquisition_mode: value});
                break;
            case "trigger_source":
                update_control_state({...controls_state, trigger_source: value});
                break;
        }
        set_remote_version(remote_version + 1);
    }

    useEffect(() => {
        let next_acq = {
            level: controls_state.trigger_level,
            level_type: "int",
            mode: controls_state.acquisition_mode.value,
            trigger: controls_state.trigger_mode.value,
            prescaler:controls_state.tb_prescaler,
            source:parseInt(controls_state.trigger_source.value),
            trigger_point:controls_state.trigger_point
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
                        update_control_state({...controls_state, trigger_level: parseFloat(event.target.value)});
                        set_remote_version(remote_version + 1);
                    }
                    break;
                case "trigger_point":
                    if(event.target.value.match("^\\d+")) {
                        update_control_state({...controls_state, trigger_point: parseInt(event.target.value)});
                        set_remote_version(remote_version + 1);
                    }
                    break;
                case  "tb_prescaler":
                    if(event.target.value.match("^\\d+")) {
                        update_control_state({...controls_state, tb_prescaler: parseInt(event.target.value)});
                        set_remote_version(remote_version + 1);
                    }
                    break;
            }

        }

    }


    let plot_status = () =>{
        if(props.showAcquisitionStatus){
            return <Chip status={props.acquisition_status} >{props.acquisition_status}</Chip>
        }
    }

    return(
        <div>
            {plot_status()}
            <InputField
                inline
                ID="trigger_level"
                name='trigger_level'
                defaultValue={controls_state.trigger_level}
                onKeyDown={handle_set_value}
                label="Trigger Level"
            />
            <InputField
                inline
                ID="trigger_point"
                name='trigger_point'
                defaultValue={controls_state.trigger_point}
                onKeyDown={handle_set_value}
                label="Trigger point"
            />
            <SelectField
                inline
                label="Acquisition mode"
                onChange={handle_select}
                value={controls_state.acquisition_mode}
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
                value={controls_state.trigger_source}
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
                value={controls_state.trigger_mode}
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
                defaultValue={controls_state.tb_prescaler}
                onKeyDown={handle_set_value}
                label="Timebase Prescaler"
            />
            <PlotControls onPlay={props.onPlay} onPause={props.onPause} onDownload={props.onDownload} onStop={props.onStop}/>
        </div>

    );
};

export default TriggerControls;
