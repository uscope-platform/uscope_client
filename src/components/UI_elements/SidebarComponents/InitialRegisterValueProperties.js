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
import {MdArrowDropDown, MdArrowDropUp} from "react-icons/md";
import {InputField} from "../InputField";

import {Button} from "../Button";
import {SidebarCollapsableContentLayout} from "../Layouts/SidebarCollapsableContentLayout";
import {SidebarCollapsableNameLayout} from  "../Layouts/SidebarCollapsableNameLayout";
import {ColorTheme} from "../ColorTheme";

export let  InitialRegisterValue = props =>{

    const [is_open, set_is_open] = useState(false);

    let handleOpen = ()=>{
        set_is_open(true);
    }


    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.application.edit_irv(props.irv.address,event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemoveRegister= (event) =>{
        props.application.remove_irv(props.irv.address).then(()=>{
            props.forceUpdate();
        });
    }

    let renderChannelContent = (props) =>{
        if(is_open)
            return(
                <SidebarCollapsableContentLayout>
                    <InputField inline ID="address" name="address" defaultValue={props.irv.address} onKeyDown={handleonKeyDown} label="Address"/>
                    <InputField inline ID="value" name='value' defaultValue={props.irv.value} onKeyDown={handleonKeyDown} label="Value"/>
                    <Button onClick={handleRemoveRegister} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                <Label>{props.irv.address}</Label>
                {is_open
                    ? <MdArrowDropUp size={ColorTheme.icons_size} onClick={handleClose} color={ColorTheme.icons_color}/>
                    : <MdArrowDropDown size={ColorTheme.icons_size} onClick={handleOpen} color={ColorTheme.icons_color}/>
                }
            </SidebarCollapsableNameLayout>
            {
                renderChannelContent(props)
            }
        </>
    );
};