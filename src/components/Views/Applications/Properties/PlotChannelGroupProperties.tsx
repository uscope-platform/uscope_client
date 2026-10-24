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
import {styled} from "goober";
import {
    FormLayout,
    ChipSelector,
    ColorTheme,
    Label,
    Card
} from "#UI/index.js";

import {up_application} from "#client_core/index.js";
import type {channel, channel_group} from "#interfaces/index.js";

// the state of a group that can be the default one: a badge when it is, a quiet button to make it
const DefaultBadge = styled('span')`
  margin-left: auto;
  margin-right: 0.5rem;
  padding: 0.15em 0.8em;
  border-radius: 3px;
  font-size: 0.85rem;
  font-weight: 600;
  color: black;
  background: ${ColorTheme.background.accents};
`

const MakeDefaultButton = styled('button')`
  margin-left: auto;
  margin-right: 0.5rem;
  padding: 0.15em 0.8em;
  border-radius: 3px;
  font-size: 0.85rem;
  cursor: pointer;
  color: ${ColorTheme.text};
  background: transparent;
  border: 1px solid ${ColorTheme.background.bordersLight};
  &:hover {
    color: ${ColorTheme.background.accents};
    border-color: ${ColorTheme.background.accents};
  }
`

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

    // only one group is the default one, so this is not a toggle: another group is made the default
    let handleMakeDefault = async ()=>{
        await props.application.set_default_channel_group(props.group.group_name);
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

    return(
        <Card
            style={{width: "100%", paddingLeft: 0}}
            actions={props.group.default
                ? <DefaultBadge>Default</DefaultBadge>
                : <MakeDefaultButton onClick={handleMakeDefault}>Set as default</MakeDefaultButton>
            }
        >
            <FormLayout columns="10.5rem">
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
