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

import React from 'react';

import {MdStar} from "react-icons/md";

import {ColorTheme, ItemsEditor} from "#UI/index.js";
import {MacroProperties, MiscFieldProperties, PlotChannelGroupProperties, PlotChannelProperties, ParameterProperties} from "#components/Views/Applications/Properties/index.js";
import type {up_application} from "#client_core/index.js";
import {useAppSelector} from "#redux/hooks.js";

interface EditorProps {
    application: up_application;
    forceUpdate: () => void;
    onAdd: () => void;
}

/// The channels of the scope of an application
export let ChannelsEditor = (props: EditorProps) =>(
    <ItemsEditor
        items={props.application.channels}
        noun="channels"
        name={ch => ch.name}
        description={ch => "#" + ch.number + (ch.enabled ? "" : " · disabled")}
        onAdd={props.onAdd}
        onRename={async (ch, name) => {
            await props.application.edit_channel(ch.name, "name", name);
            props.forceUpdate();
        }}
        onRemove={async ch => {
            await props.application.remove_channel(ch.name);
            props.forceUpdate();
        }}
    >
        {ch => <PlotChannelProperties application={props.application} forceUpdate={props.forceUpdate} channel={ch}/>}
    </ItemsEditor>
);

/// The groups of channels shown together by the scope
export let ChannelGroupsEditor = (props: EditorProps) =>(
    <ItemsEditor
        items={props.application.channel_groups}
        noun="channel groups"
        name={group => group.group_name}
        // the star marks the default group, the others have a space of its width so that the names line up
        icon={group => group.default
            ? <MdStar size="1.4em" color={ColorTheme.background.accents} style={{flexShrink: 0, marginTop: "0.25em"}}/>
            : <span style={{display: "inline-block", width: "1.4em", flexShrink: 0}}/>}
        description={group => group.channels.map(c => c.label).join(", ")}
        onAdd={props.onAdd}
        onRename={async (group, name) => {
            await props.application.edit_channel_group(group.group_name, "group_name", name);
            props.forceUpdate();
        }}
        onRemove={async group => {
            await props.application.remove_channel_groups(group.group_name);
            // the scope needs a default group, the first of the others takes over
            const groups = props.application.channel_groups;
            if(groups[0] !== undefined && !groups.some(g => g.default)){
                await props.application.set_default_channel_group(groups[0].group_name);
            }
            props.forceUpdate();
        }}
    >
        {group => <PlotChannelGroupProperties application={props.application} forceUpdate={props.forceUpdate} group={group}/>}
    </ItemsEditor>
);

/// The parameters of an application
export let ParametersEditor = (props: EditorProps) =>(
    <ItemsEditor
        items={props.application.parameters}
        noun="parameters"
        name={parameter => parameter.parameter_name}
        description={parameter => parameter.parameter_id + (parameter.visible ? "" : " · hidden")}
        onAdd={props.onAdd}
        onRemove={async parameter => {
            await props.application.remove_parameter(parameter.parameter_id);
            props.forceUpdate();
        }}
    >
        {parameter => <ParameterProperties application={props.application} forceUpdate={props.forceUpdate} parameter={parameter}/>}
    </ItemsEditor>
);

/// The macros of an application, the actions that run a script
export let MacrosEditor = (props: EditorProps) =>{
    const scripts = useAppSelector(state => state.scripts);

    return(
        <ItemsEditor
            items={props.application.macro}
            noun="macros"
            name={macro => macro.name}
            description={macro => macro.trigger !== null ? (scripts[macro.trigger]?.name ?? "Script not found") : "No script"}
            onAdd={props.onAdd}
            onRename={async (macro, name) => {
                await props.application.edit_macro(macro.name, "name", name);
                props.forceUpdate();
            }}
            onRemove={async macro => {
                await props.application.remove_macro(macro.name);
                props.forceUpdate();
            }}
        >
            {macro => <MacroProperties application={props.application} forceUpdate={props.forceUpdate} macro={macro}/>}
        </ItemsEditor>
    );
};

/// The free fields of an application, a name and a value each, that scripts and the hardware read
export let MiscEditor = (props: EditorProps) =>{
    // the name and the bitstream of the application are not fields of it, an older version of the page kept them here
    const fields = Object.entries(props.application.miscellaneous)
        .filter(([name]) => name !== "application_name" && name !== "bitstream")
        .map(([name, value]) => ({name, value: String(value)}));

    return(
        <ItemsEditor
            items={fields}
            noun="fields"
            name={field => field.name}
            description={field => field.value}
            onAdd={props.onAdd}
            onRename={async (field, name) => {
                await props.application.edit_misc_param(field.name, name, true);
                props.forceUpdate();
            }}
            onRemove={async field => {
                await props.application.remove_misc_field(field.name);
                props.forceUpdate();
            }}
        >
            {field => <MiscFieldProperties application={props.application} forceUpdate={props.forceUpdate} name={field.name} value={field.value}/>}
        </ItemsEditor>
    );
};
