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
import {
    InputField,
    Checkbox,
    SelectField,
    Card
} from "#UI/index.js";

import {up_application, up_peripheral} from "#client_core/index.js";
import {HdlParameterProperties} from "./HdlParameterProperties.jsx";
import type {peripheral_instance} from "#interfaces/index.js";
import type {SimpleStringOption} from "#UI/Select.js";

interface PeripheralPropertiesProps{
    application: up_application,
    peripheral: peripheral_instance,
    peripherals: Record<number, up_peripheral>,
    forceUpdate: ()=>void,
}

export let  PeripheralProperties = (props: PeripheralPropertiesProps) =>{

    let peripherals_list = Object.entries(props.peripherals).map((periph)=>{
        return {label:periph[1].name, value:periph[0]}
    })

    let initial_value: SimpleStringOption = (()=>{
        let p =  Object.values(props.peripherals).filter((p)=>{
            return p.id === parseInt(props.peripheral.spec_id);
        })[0];
        if(p === undefined)return {label: "", value: ""}
        if(props.peripheral.spec_id !== ""){
            return {label:p.name, value:props.peripheral.spec_id}
        } else {
            return {label: "", value: ""}
        }
    })();

    let [selected, set_selected] = useState(initial_value);

    let handleChange =async (event:  React.ChangeEvent<HTMLInputElement>)=>{
        await props.application.edit_peripheral(props.peripheral.name,event.target.name, event.target.checked);
        props.forceUpdate();
    }

    let handleIDChange = async (value: SimpleStringOption | null) =>{
        if(value === null)return;
        set_selected(value)
        await props.application.edit_peripheral(props.peripheral.name,"spec_id", value.value);
        props.forceUpdate();
    }

    let handleonKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            await props.application.edit_peripheral(props.peripheral.name,event.currentTarget.name, event.currentTarget.value);
            props.forceUpdate();
        }
    }

    let handleRemove=async () =>{
        await props.application.remove_peripheral(props.peripheral.name);
        props.forceUpdate();
    }

    let handle_parameter_change = async (change: {type:string, name:string, new_value:number}) =>{

        let peripheral = props.application.peripherals.filter((p) =>{
            return p.peripheral_id === props.peripheral.peripheral_id;
        });
        if(peripheral.length === 0 || peripheral[0]=== undefined)return;
        let parameters = peripheral[0].hdl_parameters;
        if(change.type ==="name"){
            let value = parameters[change.name];
            if(value === undefined)return;
            delete parameters[change.name];
            parameters[change.new_value] = value;
        } else {
            parameters[change.name] = change.new_value;
        }
        await props.application.edit_peripheral(props.peripheral.name,"hdl_parameters", parameters);
        props.forceUpdate();
    }

    let render_hdl_parameters = ()=>{
      return Object.keys(props.peripheral.hdl_parameters).map((item: string) =>{
          let parameter = props.peripheral.hdl_parameters[item];
          if(parameter === undefined)return;
          return(<HdlParameterProperties name={item} value={parameter} onChange={handle_parameter_change}/>)
      })
    };

    return(
        <Card
            name={props.peripheral.name}
            onRemove={handleRemove}
        >
            <InputField inline id="name" name="name" defaultValue={props.peripheral.name} onKeyDown={handleonKeyDown} label="Name"/>
            <InputField inline id="peripheral_id" name='peripheral_id' defaultValue={props.peripheral.peripheral_id} onKeyDown={handleonKeyDown} label="Peripheral id"/>
            <SelectField<SimpleStringOption>
                label="IP type"
                onChange={handleIDChange}
                value={selected}
                name="spec_id"
                options={peripherals_list}
            />
            <InputField inline id="base_address" name='base_address' defaultValue={props.peripheral.base_address} onKeyDown={handleonKeyDown} label="Base Address"/>
            <InputField inline id="type" name='type' defaultValue={props.peripheral.type} onKeyDown={handleonKeyDown} label="Type"/>
            <Checkbox name='proxied' value={props.peripheral.proxied} onChange={handleChange} label="Proxied Peripheral"/>
            <InputField inline id="proxy_address" name='proxy_address' disabled={!props.peripheral.proxied} defaultValue={props.peripheral.proxy_address} onKeyDown={handleonKeyDown} label="Proxy Address"/>
            <InputField inline id="proxy_type" name='proxy_type' disabled={!props.peripheral.proxied} defaultValue={props.peripheral.proxy_type} onKeyDown={handleonKeyDown} label="Proxy Type"/>
            {render_hdl_parameters()}
        </Card>
    );
};
