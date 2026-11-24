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
    FormLayout,
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
            const field = event.currentTarget.name;
            let value: string | number = event.currentTarget.value;
            // these fields are numeric in the channel model, the input only gives text
            if(field === "number" || field === "mux_setting"){
                const parsed = Number(value);
                if(value.trim() === "" || !Number.isFinite(parsed)) return;
                value = parsed;
            }
            await props.application.edit_channel(props.channel.name, field, value);
            props.forceUpdate();
        }
    }

    return(
        <Card
            style={{width: "100%", paddingLeft: 0}}
            selector={{
                name:"enabled",
                label:"Enabled",
                click:handleChange,
                value:props.channel.enabled
            }}
        >
            <FormLayout columns="10.5rem">
                <InputField  id="number" name='number' defaultValue={props.channel.number.toString()} onKeyDown={handleonKeyDown} label="Channel Number"/>
                <InputField  id="mux_setting" name='mux_setting' defaultValue={props.channel.mux_setting.toString()} onKeyDown={handleonKeyDown} label="Mux Setting"/>
                <InputField  id="scaling_factor" name='scaling_factor' defaultValue={props.channel.scaling_factor.toString()} onKeyDown={handleonKeyDown} label="Scaling Factor"/>
            </FormLayout>
        </Card>
    );
};