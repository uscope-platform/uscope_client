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
} from "../../../UI_elements";

import {up_application} from "../../../../client_core";


export let  PlotChannelProperties = props =>{


    let handleChange = (target)=>{
        let app = new up_application(props.application);
        app.edit_channel(props.channel.name, target.name, target.checked).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let app = new up_application(props.application);
            app.edit_channel(props.channel.name, event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemove= (event) =>{
        let app = new up_application(props.application);
        app.remove_channel(props.channel.name).then(()=>{
            props.forceUpdate();
        });
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
            <InputField color={ColorTheme.background.level_4} inline ID="name" name="name" defaultValue={props.channel.name} onKeyDown={handleonKeyDown} label="Name"/>
            <InputField color={ColorTheme.background.level_4} inline ID="id" name='id' defaultValue={props.channel.id} onKeyDown={handleonKeyDown} label="Channel ID"/>
            <InputField color={ColorTheme.background.level_4} inline ID="number" name='number' defaultValue={props.channel.number} onKeyDown={handleonKeyDown} label="Channel Number"/>
            <InputField color={ColorTheme.background.level_4} inline ID="mux_setting" name='mux_setting' defaultValue={props.channel.mux_setting} onKeyDown={handleonKeyDown} label="Mux Setting"/>
            <InputField color={ColorTheme.background.level_4} inline ID="scaling_factor" name='scaling_factor' defaultValue={props.channel.scaling_factor} onKeyDown={handleonKeyDown} label="Scaling Factor"/>
        </Card>
    );
};