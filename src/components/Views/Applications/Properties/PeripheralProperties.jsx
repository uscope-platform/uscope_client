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
} from "@UI";

import {up_application} from "#client_core";
import {HdlParameterProperties} from "./HdlParameterProperties";



export let  PeripheralProperties = props =>{

    let peripherals_list = Object.entries(props.peripherals).map((periph)=>{
        return {label:periph[1].name, value:periph[0]}
    })

    let [selected, set_selected] = useState((()=>{
        let p =  Object.values(props.peripherals).filter((p)=>{
            return p.id === parseInt(props.peripheral.spec_id);
        })[0];
        if(props.peripheral.spec_id !== ""){
            return {label:p.name, value:parseInt(props.peripheral.spec_id)}
        } else {
            return {label: "", value: null}
        }
    })());

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

    let handle_parameter_change = (change) =>{

        let app = new up_application(props.application);
        let parameters = app.peripherals.filter((p) =>{
            return p.peripheral_id === props.peripheral.peripheral_id;
        })[0].hdl_parameters;
        if(change.type ==="name"){
            let value = parameters[change.name];
            delete parameters[change.name];
            parameters[change.new_value] = value;
        } else {
            parameters[change.name] = change.new_value;
        }
        app.edit_peripheral(props.peripheral.name,"hdl_parameters", parameters).then(()=>{
            props.forceUpdate();
        });
    }

    let render_hdl_parameters = ()=>{
      return Object.keys(props.peripheral.hdl_parameters).map((item) =>{
          return(<HdlParameterProperties key={name} name={item} value={props.peripheral.hdl_parameters[item]} onChange={handle_parameter_change}/>)
      })
    };

    return(
        <Card
            name={props.peripheral.name}
            onRemove={handleRemove}
        >
            <InputField inline id="name" name="name" defaultValue={props.peripheral.name} onKeyDown={handleonKeyDown} label="Name"/>
            <InputField inline id="peripheral_id" name='peripheral_id' defaultValue={props.peripheral.peripheral_id} onKeyDown={handleonKeyDown} label="Peripheral id"/>
            <SelectField label="IP type"
                         onChange={handleIDChange}
                         value={selected}
                         name="spec_id"
                         placeholder="Peripheral type"
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
