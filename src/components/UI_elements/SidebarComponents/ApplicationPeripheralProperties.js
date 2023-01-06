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
import {Checkbox} from "../checkbox";

import {Button} from "../Button";
import {SidebarCollapsableContentLayout} from "../Layouts/SidebarCollapsableContentLayout";
import {SidebarCollapsableNameLayout} from  "../Layouts/SidebarCollapsableNameLayout";
import {SelectField} from "../Select";
import {ColorTheme} from "../ColorTheme";



export let  ApplicationPeripheralProperties = props =>{


    const [is_open, set_is_open] = useState(false);


    let handleOpen = ()=>{
        set_is_open(true);
    }

    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleChange = (event)=>{
        props.application.edit_peripheral(props.peripheral.name,event.target.name, event.target.checked).then(()=>{
            props.forceUpdate();
        });
    }

    let handleIDChange = (event)=>{
        props.application.edit_peripheral(props.peripheral.name,event.target.name, event.target.value).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.application.edit_peripheral(props.peripheral.name,event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemoveRegister= (event) =>{
            props.application.remove_peripheral(props.peripheral.name).then(()=>{
            props.forceUpdate();
        });
    }

    let renderContent = (props) =>{
        let peripherals_list = Object.entries(props.peripherals).map((periph)=>{
            return periph[0];
        })
        if(is_open)
            return(
                <SidebarCollapsableContentLayout>
                    <InputField inline ID="name" name="name" defaultValue={props.peripheral.name} onKeyDown={handleonKeyDown} label="Name"/>
                    <InputField inline ID="peripheral_id" name='peripheral_id' defaultValue={props.peripheral.peripheral_id} onKeyDown={handleonKeyDown} label="Peripheral id"/>
                    <SelectField label="IP type" onChange={handleIDChange} defaultValue={props.peripheral.spec_id}
                                 name="spec_id" placeholder="Peripheral type" options={peripherals_list}/>
                    <InputField inline ID="base_address" name='base_address' defaultValue={props.peripheral.base_address} onKeyDown={handleonKeyDown} label="Base Address"/>
                    <InputField inline ID="type" name='type' defaultValue={props.peripheral.type} onKeyDown={handleonKeyDown} label="Type"/>
                    <Checkbox name='proxied' value={props.peripheral.proxied} onChange={handleChange} label="Proxied Peripheral"/>
                    <InputField inline ID="proxy_address" name='proxy_address' disabled={!props.peripheral.proxied} defaultValue={props.peripheral.proxy_address} onKeyDown={handleonKeyDown} label="Proxy Address"/>
                    <InputField inline ID="proxy_type" name='proxy_type' disabled={!props.peripheral.proxied} defaultValue={props.peripheral.proxy_type} onKeyDown={handleonKeyDown} label="Proxy Type"/>
                    <Button onClick={handleRemoveRegister} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                <Label>{props.peripheral.name}</Label>
                {is_open
                    ? <MdArrowDropUp size={ColorTheme.icons_size} onClick={handleClose} color={ColorTheme.icons_color}/>
                    : <MdArrowDropDown size={ColorTheme.icons_size} onClick={handleOpen} color={ColorTheme.icons_color}/>
                }
            </SidebarCollapsableNameLayout>
            {
                renderContent(props)
            }
        </>
    );
};
