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

import {Button} from "../Button";
import {SidebarCollapsableContentLayout} from "../Layouts/SidebarCollapsableContentLayout";
import {SidebarCollapsableNameLayout} from  "../Layouts/SidebarCollapsableNameLayout";


export let  MacroProperties = props =>{


    const [is_open, set_is_open] = useState(false);


    let handleOpen = ()=>{
        set_is_open(true);
    }
    
    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.application.edit_macro(props.macro.name, event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemoveRegister= (event) =>{
        props.application.remove_macro(props.macro.name).then(()=>{
            props.forceUpdate();
        });
    }

    let renderChannelContent = (props) =>{
        if(is_open)
            return(
                <SidebarCollapsableContentLayout>
                    <InputField inline ID='name' name='name' defaultValue={props.macro.name} onKeyDown={handleonKeyDown} label="Name"/>
                    <InputField inline ID='trigger'  name='trigger' defaultValue={props.macro.trigger} onKeyDown={handleonKeyDown} label="Trigger"/>
                    <Button onClick={handleRemoveRegister} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                <Label>{props.macro.name}</Label>
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
