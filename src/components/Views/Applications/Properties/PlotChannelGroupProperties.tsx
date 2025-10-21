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
} from "#UI/index.js";

import {up_application} from "#client_core/index.js";
import type {channel_group} from "#interfaces/index.js";
import type {MultiValue} from "react-select";
import type {group_channel_token} from "#interfaces/client_core/application.js";

interface PlotChannelGroupPropertiesProps{
    application: up_application,
    group: channel_group,
    forceUpdate: ()=>void,
}
export let  PlotChannelGroupProperties = (props:PlotChannelGroupPropertiesProps) =>{

    const [channels_list, set_channels_list] = useState(props.group.channels);

    let options = props.application.channels.map((ch)=>{
        return {label:ch.name, value:ch.id}
    });

    let handleChangeDefault = async (target:  {name: string, checked: boolean})=>{
        await props.application.edit_channel_group(props.group.group_name, target.name, target.checked);
        props.forceUpdate();
    }


    let handleChange = async (group: MultiValue<group_channel_token>)=>{
        if(group.length<=6){
            set_channels_list([...group]);
            await props.application.edit_channel_group(props.group.group_name, "channels", group);
            props.forceUpdate();
        }

    }

    let handleonKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            await props.application.edit_channel_group(props.group.group_name, event.currentTarget.name, event.currentTarget.value);
            props.forceUpdate();
        }
    }

    let handleRemove= async () =>{
        await props.application.remove_channel_groups(props.group.group_name)
        props.forceUpdate();
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
            <InputField inline id="group_name" name="group_name" defaultValue={props.group.group_name} onKeyDown={handleonKeyDown} label="Name"/>
            <InputField inline id="group_id" name='group_id' defaultValue={props.group.group_id} onKeyDown={handleonKeyDown} label="ID"/>
            <MultiSelect<group_channel_token>
                inline
                id="content"
                onChange={handleChange}
                value={channels_list}
                options={options}
                label="Content"/>
        </Card>
    );
};