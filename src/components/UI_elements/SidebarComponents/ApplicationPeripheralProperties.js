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

import {useSelector} from "react-redux";
import {Button} from "../Button";
import {SidebarCollapsableContentLayout} from "../Layouts/SidebarCollapsableContentLayout";
import {SidebarCollapsableNameLayout} from  "../Layouts/SidebarCollapsableNameLayout";
import {SelectField} from "../Select";
import {edit_application} from "../../../client_core";



export let  ApplicationPeripheralProperties = props =>{

    const peripherals = useSelector(state => state.peripherals);

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
            let edit = {application:props.application, peripheral:props.peripheral.name, field:event.target.name, value:event.target.value, action:"edit_peripheral"};
            edit_application(edit)
            set_edit_name(false);
        }else if(event.key ==="Escape"){
            set_edit_name(false);
        }
    }

    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleChange = (event)=>{
        let edit = {application:props.application, peripheral:props.peripheral.name, field:event.target.name, value:event.target.checked, action:"edit_peripheral"};
        edit_application(edit)

    }

    let handleIDChange = (event)=>{
        let edit = {application:props.application, peripheral:props.peripheral.name, field:event.target.name, value:event.target.value, action:"edit_peripheral"};
        edit_application(edit)
    }

    let handleonKeyDown = (event) =>{
        let edit = {}
        if(event.key==="Enter"|| event.key ==="Tab"){
            edit = {application:props.application, peripheral:props.peripheral.name, field:event.target.name, value:event.target.value, action:"edit_peripheral"};
            edit_application(edit)

        }
    }

    let handleRemoveRegister= (event) =>{
        let edit = {application:props.application, peripheral:props.peripheral.name, action:"remove_peripheral"};
        edit_application(edit)
    }

    let renderContent = (props) =>{
        let peripherals_list = Object.entries(peripherals).map((periph)=>{
            return periph[0];
        })
        if(is_open)
            return(
                <SidebarCollapsableContentLayout>
                    <InputField inline name='peripheral_id' defaultValue={props.peripheral.peripheral_id} onKeyDown={handleonKeyDown} label="Peripheral id"/>
                    <SelectField label="peripheral ID" onChange={handleIDChange} defaultValue={props.peripheral.spec_id}
                                 name="spec_id" placeholder="Peripheral type" options={peripherals_list}/>
                    <InputField inline name='base_address' defaultValue={props.peripheral.base_address} onKeyDown={handleonKeyDown} label="Base Address"/>
                    <InputField inline name='type' defaultValue={props.peripheral.type} onKeyDown={handleonKeyDown} label="Type"/>
                    <Checkbox name='proxied' value={props.peripheral.proxied} onChange={handleChange} label="Proxied Peripheral"/>
                    <InputField inline name='proxy_address' disabled={!props.peripheral.proxied} defaultValue={props.peripheral.proxy_address} onKeyDown={handleonKeyDown} label="Proxy Address"/>
                    <InputField inline name='proxy_type' disabled={!props.peripheral.proxied} defaultValue={props.peripheral.proxy_type} onKeyDown={handleonKeyDown} label="Proxy Type"/>
                    <Checkbox name='user_accessible' value={props.peripheral.user_accessible} onChange={handleChange} label="User Accessible"/>
                    <Button onClick={handleRemoveRegister} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                {edit_name
                    ? <InputField compact name="name" defaultValue={props.peripheral.name} onKeyDown={handleEditNameChange} label={props.peripheral.name}/>
                    : <Label onDoubleClick={handleEditName}>{props.peripheral.name}</Label>
                }

                {is_open
                    ? <CaretUp size={"small"} onClick={handleClose} color='white'/>
                    : <CaretDown size={"small"} onClick={handleOpen} color='white'/>
                }
            </SidebarCollapsableNameLayout>
            {
                renderContent(props)
            }
        </>
    );
};
