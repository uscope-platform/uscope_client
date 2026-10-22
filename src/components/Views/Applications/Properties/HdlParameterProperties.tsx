// Copyright 2024 Filippo Savi
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

import React from "react";
import {InputField, DeleteButton} from "#UI/index.js";
import {format_parameter, parse_parameter} from "#client_core/index.js";
import type {hdl_parameter} from "#interfaces/index.js";
import {styled} from "goober";


/// a name, a value and a remove button on one line
const ParameterRow = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 2rem;
  gap: 0.5rem;
  align-items: center;
`

export const ParameterHeader = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 2rem;
  gap: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.6;
`

export interface HdlParameterChange {
    type: "name" | "value" | "remove";
    name: string;
    new_value: hdl_parameter | string;
}

interface HdlParameterProps {
    name:string
    onChange: (change: HdlParameterChange)=>void
    value:hdl_parameter
}

export let  HdlParameterProperties = (props:HdlParameterProps) =>{

    let handleonKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key !== "Enter" && event.key !== "Tab") return;
        const value = event.currentTarget.value;
        if(event.currentTarget.name === "name"){
            if(value !== props.name) props.onChange({type:"name", name:props.name, new_value:value});
        } else {
            const parsed = parse_parameter(value, props.value);
            if(parsed !== null) props.onChange({type:"value", name:props.name, new_value:parsed});
        }
    }

    return(
        <ParameterRow>
            <InputField compact id={"name_" + props.name} name="name" defaultValue={props.name} onKeyDown={handleonKeyDown} label="Name"/>
            <InputField compact id={"value_" + props.name} name="value" defaultValue={format_parameter(props.value)} onKeyDown={handleonKeyDown} label="Value"/>
            <DeleteButton name={props.name} onRemove={() => props.onChange({type:"remove", name:props.name, new_value:0})}/>
        </ParameterRow>
    );
};
