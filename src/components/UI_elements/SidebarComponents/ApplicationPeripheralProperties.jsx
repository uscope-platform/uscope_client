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
import {InputField} from "../InputField";
import {Checkbox} from "../checkbox";

import {SelectField} from "../Select";
import {up_application} from "../../../client_core";
import {Card} from "../panels/Card";



export let  ApplicationPeripheralProperties = props =>{

    let peripherals_list = Object.entries(props.peripherals).map((periph)=>{
        return {label:periph[0], value:periph[0]}
    })

    const [selected, set_selected] = useState({label:props.peripheral.spec_id, value:props.peripheral.spec_id});



    let handleChange = (event)=>{
        let app = new up_application(props.application);
        app.edit_peripheral(props.peripheral.name,event.target.name, event.target.checked).then(()=>{
            props.forceUpdate();
        });
    }

    let handleIDChange = (event)=>{
        set_selected(event)
        let app = new up_application(props.application);
        app.edit_peripheral(props.peripheral.name,"spec_id", event.value).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let app = new up_application(props.application);
            app.edit_peripheral(props.peripheral.name,event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemove= (event) =>{
        let app = new up_application(props.application);
            app.remove_peripheral(props.peripheral.name).then(()=>{
            props.forceUpdate();
        });
    }

    return(
        <Card
            name={props.peripheral.name}
            onRemove={handleRemove}
        >
            <InputField inline ID="name" name="name" defaultValue={props.peripheral.name} onKeyDown={handleonKeyDown} label="Name"/>
            <InputField inline ID="peripheral_id" name='peripheral_id' defaultValue={props.peripheral.peripheral_id} onKeyDown={handleonKeyDown} label="Peripheral id"/>
            <SelectField label="IP type"
                         onChange={handleIDChange}
                         value={selected}
                         name="spec_id"
                         placeholder="Peripheral type"
                         options={peripherals_list}
            />
            <InputField inline ID="base_address" name='base_address' defaultValue={props.peripheral.base_address} onKeyDown={handleonKeyDown} label="Base Address"/>
            <InputField inline ID="type" name='type' defaultValue={props.peripheral.type} onKeyDown={handleonKeyDown} label="Type"/>
            <Checkbox name='proxied' value={props.peripheral.proxied} onChange={handleChange} label="Proxied Peripheral"/>
            <InputField inline ID="proxy_address" name='proxy_address' disabled={!props.peripheral.proxied} defaultValue={props.peripheral.proxy_address} onKeyDown={handleonKeyDown} label="Proxy Address"/>
            <InputField inline ID="proxy_type" name='proxy_type' disabled={!props.peripheral.proxied} defaultValue={props.peripheral.proxy_type} onKeyDown={handleonKeyDown} label="Proxy Type"/>
        </Card>
    );
};