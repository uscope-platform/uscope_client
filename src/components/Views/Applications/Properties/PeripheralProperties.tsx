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
    Card,
    FormLayout,
    ColorTheme
} from "#UI/index.js";
import {styled} from "goober";

import {up_application, up_peripheral} from "#client_core/index.js";
import {HdlParameterProperties, ParameterHeader, type HdlParameterChange} from "./HdlParameterProperties.jsx";
import type {peripheral_instance, SimpleStringOption, hdl_parameter} from "#interfaces/index.js";


const SectionTitle = styled('div')`
  grid-column: 1 / -1;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${ColorTheme.inactive_icons_color};
  border-bottom: 1px solid ${ColorTheme.background.borders};
`

const ParametersLayout = styled('div')`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const COLUMN_WIDTH = "10.5rem";

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

    let handle_parameter_change = async (change: HdlParameterChange) =>{

        let peripheral = props.application.peripherals.filter((p) =>{
            return p.peripheral_id === props.peripheral.peripheral_id;
        });
        if(peripheral.length === 0 || peripheral[0]=== undefined)return;
        let parameters = peripheral[0].hdl_parameters;
        if(change.type ==="name"){
            let value = parameters[change.name];
            if(value === undefined)return;
            delete parameters[change.name];
            parameters[String(change.new_value)] = value;
        } else if(change.type === "remove"){
            delete parameters[change.name];
        } else {
            parameters[change.name] = change.new_value as hdl_parameter;
        }
        await props.application.edit_peripheral(props.peripheral.name,"hdl_parameters", parameters);
        props.forceUpdate();
    }

    let render_hdl_parameters = ()=>{
      return Object.keys(props.peripheral.hdl_parameters).map((item: string) =>{
          let parameter = props.peripheral.hdl_parameters[item];
          if(parameter === undefined)return;
          return(<HdlParameterProperties key={item} name={item} value={parameter} onChange={handle_parameter_change}/>)
      })
    };

    const parameters = render_hdl_parameters();

    return(
        <Card
            name={props.peripheral.name}
            style={{width: "100%", paddingLeft: 0}}
        >
            <FormLayout columns={COLUMN_WIDTH}>
                <InputField id="name" name="name" defaultValue={props.peripheral.name} onKeyDown={handleonKeyDown} label="Name"/>
                <InputField id="peripheral_id" name='peripheral_id' defaultValue={props.peripheral.peripheral_id} onKeyDown={handleonKeyDown} label="Peripheral id"/>
                <SelectField<SimpleStringOption>
                    stacked
                    label="IP type"
                    onChange={handleIDChange}
                    value={selected}
                    name="spec_id"
                    options={peripherals_list}
                />
                <InputField id="base_address" name='base_address' defaultValue={props.peripheral.base_address} onKeyDown={handleonKeyDown} label="Base Address"/>
                <InputField id="type" name='type' defaultValue={props.peripheral.type} onKeyDown={handleonKeyDown} label="Type"/>

                <div style={{gridColumn: "1 / -1"}}>
                    <Checkbox name='proxied' value={props.peripheral.proxied} onChange={handleChange} label="Proxied Peripheral"/>
                </div>
                {props.peripheral.proxied && <>
                    <InputField id="proxy_address" name='proxy_address' defaultValue={props.peripheral.proxy_address} onKeyDown={handleonKeyDown} label="Proxy Address"/>
                    <InputField id="proxy_type" name='proxy_type' defaultValue={props.peripheral.proxy_type} onKeyDown={handleonKeyDown} label="Proxy Type"/>
                </>}

                {parameters.length > 0 && <>
                    <SectionTitle>HDL parameters</SectionTitle>
                    <ParametersLayout>
                        <ParameterHeader><span>Name</span><span>Value</span></ParameterHeader>
                        {parameters}
                    </ParametersLayout>
                </>}
            </FormLayout>
        </Card>
    );
};
