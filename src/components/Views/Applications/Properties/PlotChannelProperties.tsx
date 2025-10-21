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

import React from "react";
import {
    InputField,
    ColorTheme,
    Card
} from "#UI/index.js";

import {up_application} from "#client_core/index.js";
import type {channel} from "#interfaces/index.js";

interface PlotChannelPropertiesProps{
    application: up_application,
    channel: channel,
    forceUpdate: ()=>void,
}

export let  PlotChannelProperties = (props: PlotChannelPropertiesProps) =>{


    let handleChange =async (target: {name: string, checked: boolean})=>{
        await props.application.edit_channel(props.channel.name, target.name, target.checked);
        props.forceUpdate();
    }

    let handleonKeyDown =async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            await props.application.edit_channel(props.channel.name, event.currentTarget.name, event.currentTarget.value);
            props.forceUpdate();
        }
    }

    let handleRemove= async () =>{
        await props.application.remove_channel(props.channel.name);
        props.forceUpdate();
    }

    return(
        <Card
            name={props.channel.name}
            onRemove={handleRemove}
            selector={{
                name:"enabled",
                label:"Enabled",
                click:handleChange,
                value:props.channel.enabled
            }}
        >
            <InputField color={ColorTheme.background.level_4} inline id="name" name="name" defaultValue={props.channel.name} onKeyDown={handleonKeyDown} label="Name"/>
            <InputField color={ColorTheme.background.level_4} inline id="id" name='id' defaultValue={props.channel.id} onKeyDown={handleonKeyDown} label="Channel ID"/>
            <InputField color={ColorTheme.background.level_4} inline id="number" name='number' defaultValue={props.channel.number.toString()} onKeyDown={handleonKeyDown} label="Channel Number"/>
            <InputField color={ColorTheme.background.level_4} inline id="mux_setting" name='mux_setting' defaultValue={props.channel.mux_setting.toString()} onKeyDown={handleonKeyDown} label="Mux Setting"/>
            <InputField color={ColorTheme.background.level_4} inline id="scaling_factor" name='scaling_factor' defaultValue={props.channel.scaling_factor.toString()} onKeyDown={handleonKeyDown} label="Scaling Factor"/>
        </Card>
    );
};