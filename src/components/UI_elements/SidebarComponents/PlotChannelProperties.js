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
import {Label} from "../Label";
import {CaretDown, CaretUp} from "grommet-icons";
import {InputField} from "../InputField";
import {Checkbox} from "../checkbox";

import {Button} from "../Button";
import {SidebarCollapsableContentLayout} from "../Layouts/SidebarCollapsableContentLayout";
import {SidebarCollapsableNameLayout} from  "../Layouts/SidebarCollapsableNameLayout";


export let  PlotChannelProperties = props =>{

    const [is_open, set_is_open] = useState(false);

    let handleOpen = ()=>{
        set_is_open(true);
    }


    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleChange = (event)=>{
        props.application.edit_channel(props.channel.name, event.target.name, event.target.checked).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.application.edit_channel(props.channel.name, event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemoveRegister= (event) =>{
        props.application.remove_channel(props.channel.name).then(()=>{
            props.forceUpdate();
        });
    }

    let renderChannelContent = (props) =>{
        if(is_open)
            return(
                <SidebarCollapsableContentLayout>
                    <InputField inline ID="name" name="name" defaultValue={props.channel.name} onKeyDown={handleonKeyDown} label="Name"/>
                    <InputField inline ID="id" name='id' defaultValue={props.channel.id} onKeyDown={handleonKeyDown} label="Channel ID"/>
                    <InputField inline ID="number" name='number' defaultValue={props.channel.number} onKeyDown={handleonKeyDown} label="Channel Number"/>
                    <InputField inline ID="mux_setting" name='mux_setting' defaultValue={props.channel.mux_setting} onKeyDown={handleonKeyDown} label="Mux Setting"/>
                    <InputField inline ID="phys_width" name='phys_width' defaultValue={props.channel.phys_width} onKeyDown={handleonKeyDown} label="Physical width"/>
                    <InputField inline ID="max_value" name='max_value' defaultValue={props.channel.max_value} onKeyDown={handleonKeyDown} label="Maximum Value"/>
                    <InputField inline ID="min_value" name='min_value' defaultValue={props.channel.min_value} onKeyDown={handleonKeyDown} label="Minimum Value"/>
                    <InputField inline ID="scaling_factor" name='scaling_factor' defaultValue={props.channel.scaling_factor} onKeyDown={handleonKeyDown} label="Scaling Factor"/>
                    <Checkbox name='enabled' value={props.channel.enabled} onChange={handleChange} label="Enabled by default"/>
                    <Button onClick={handleRemoveRegister} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                <Label>{props.channel.name}</Label>
                {is_open
                    ? <CaretUp size={"small"} onClick={handleClose} color='white'/>
                    : <CaretDown size={"small"} onClick={handleOpen} color='white'/>
                }
            </SidebarCollapsableNameLayout>
            {
                renderChannelContent(props)
            }
        </>
    );
};