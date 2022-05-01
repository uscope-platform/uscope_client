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
    const [edit_name, set_edit_name] = useState(false);



    let handleOpen = ()=>{
        set_is_open(true);
    }

    let handleEditName = () => {
        set_edit_name(true);
    }

    let handleEditNameChange = (event) => {
        if(event.key==="Enter"){
            props.application.edit_channel(props.channel.name, event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
                set_edit_name(false);
            });
        }else if(event.key ==="Escape"){
            set_edit_name(false);
        }
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
                    <InputField inline name='id' defaultValue={props.channel.id} onKeyDown={handleonKeyDown} label="Channel ID"/>
                    <InputField inline name='number' defaultValue={props.channel.number} onKeyDown={handleonKeyDown} label="Channel Number"/>
                    <InputField inline name='mux_setting' defaultValue={props.channel.mux_setting} onKeyDown={handleonKeyDown} label="Mux Setting"/>
                    <InputField inline name='phys_width' defaultValue={props.channel.phys_width} onKeyDown={handleonKeyDown} label="Physical width"/>
                    <InputField inline name='max_value' defaultValue={props.channel.max_value} onKeyDown={handleonKeyDown} label="Maximum Value"/>
                    <InputField inline name='min_value' defaultValue={props.channel.min_value} onKeyDown={handleonKeyDown} label="Minimum Value"/>
                    <Checkbox name='enabled' value={props.channel.enabled} onChange={handleChange} label="Enabled by default"/>
                    <Button onClick={handleRemoveRegister} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                {edit_name
                    ? <InputField compact name="name" defaultValue={props.channel.name} onKeyDown={handleEditNameChange} label={props.channel.name}/>
                    : <Label onDoubleClick={handleEditName}>{props.channel.name}</Label>
                }

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