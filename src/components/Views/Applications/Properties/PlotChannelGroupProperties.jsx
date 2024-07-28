// Copyright 2021 University of Nottingham Ningbo China
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

import React, {useState} from "react";
import {
    InputField,
    MultiSelect,
    Card
} from "../../../UI_elements";

import {up_application} from "../../../../client_core";

export let  PlotChannelGroupProperties = props =>{

    const [channels_list, set_channels_list] = useState(props.group.channels);

    let options = props.application.channels.map((ch)=>{
        return {label:ch.name, value:ch.id}
    });

    let handleChangeDefault = (target)=>{
        let app = new up_application(props.application);
        app.edit_channel_group(props.group.group_name, target.name, target.checked).then(()=>{
            props.forceUpdate();
        });
    }


    let handleChange = (event)=>{
        if(event.length<=6){
            set_channels_list(event);
            let app = new up_application(props.application);
            app.edit_channel_group(props.group.group_name, "channels", event).then(()=>{
                props.forceUpdate();
            });
        }

    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let app = new up_application(props.application);
            app.edit_channel_group(props.group.group_name, event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemove= () =>{
        let app = new up_application(props.application);
        app.remove_channel_groups(props.group.group_name).then(()=>{
            props.forceUpdate();
        });
    }


    return(
        <Card
            name={props.group.group_name}
            onRemove={handleRemove}
            selector={{
                name:"default",
                label:"Enabled",
                click:handleChangeDefault,
                value:props.group.default
            }}
        >
            <InputField inline ID="group_name" name="group_name" defaultValue={props.group.group_name} onKeyDown={handleonKeyDown} label="Name"/>
            <InputField inline ID="group_id" name='group_id' defaultValue={props.group.group_id} onKeyDown={handleonKeyDown} label="ID"/>
            <MultiSelect
                inline
                ID="content"
                onChange={handleChange}
                value={channels_list}
                options={options}
                label="Content"/>
        </Card>
    );
};