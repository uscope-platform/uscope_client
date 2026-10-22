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
    ChipSelector,
    Label,
    Card
} from "#UI/index.js";

import {up_application} from "#client_core/index.js";
import type {channel, channel_group} from "#interfaces/index.js";

// the scope has a color for each channel of a group, and six of them
const MAX_CHANNELS = 6;

interface PlotChannelGroupPropertiesProps{
    application: up_application,
    group: channel_group,
    forceUpdate: ()=>void,
}
export let  PlotChannelGroupProperties = (props:PlotChannelGroupPropertiesProps) =>{

    const in_group = (ch: channel) => props.group.channels.some(token => token.value === ch.id);
    const full = props.group.channels.length >= MAX_CHANNELS;

    let handleChangeDefault = async (target:  {name: string, checked: boolean})=>{
        await props.application.edit_channel_group(props.group.group_name, target.name, target.checked);
        props.forceUpdate();
    }

    // a channel is added or removed with a click on its chip
    let handleToggle = async (ch: channel) => {
        const channels = in_group(ch)
            ? props.group.channels.filter(token => token.value !== ch.id)
            : [...props.group.channels, {label: ch.name, value: ch.id}];
        if(channels.length > MAX_CHANNELS) return;
        await props.application.edit_channel_group(props.group.group_name, "channels", channels);
        props.forceUpdate();
    }

    let handleonKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            await props.application.edit_channel_group(props.group.group_name, event.currentTarget.name, event.currentTarget.value);
            props.forceUpdate();
        }
    }

    return(
        <Card
            name={props.group.group_name}
            style={{width: "100%", paddingLeft: 0}}
            selector={{
                name:"default",
                label:"Enabled",
                click:handleChangeDefault,
                value:props.group.default
            }}
        >
            <FormLayout columns="10.5rem">
                <InputField id="group_name" name="group_name" defaultValue={props.group.group_name} onKeyDown={handleonKeyDown} label="Name"/>
                <InputField id="group_id" name='group_id' defaultValue={props.group.group_id} onKeyDown={handleonKeyDown} label="ID"/>
                <div style={{gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                    <Label>Channels ({props.group.channels.length} / {MAX_CHANNELS})</Label>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(11rem, 1fr))", gap: "0.5rem"}}>
                        {props.application.channels.map((ch) => (
                            <ChipSelector
                                key={ch.id}
                                name={ch.id}
                                label={ch.name}
                                value={in_group(ch)}
                                // the ones that would go over the limit, the selected ones can still be removed
                                disabled={full && !in_group(ch)}
                                variant="tile"
                                onClick={() => handleToggle(ch)}
                            />
                        ))}
                        {props.application.channels.length === 0 &&
                            <span style={{opacity: 0.6}}>This application has no channels</span>
                        }
                    </div>
                </div>
            </FormLayout>
        </Card>
    );
};
