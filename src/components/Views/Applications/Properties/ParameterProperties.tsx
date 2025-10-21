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

import React from "react";
import {
    InputField,
    Card
} from "#UI/index.js";

import {up_application} from "#client_core/index.js";
import type {parameter} from "#interfaces/index.js";

interface ParameterPropertiesProps{
    application: up_application,
    parameter: parameter,
    forceUpdate: ()=>void,
}

export let  ParameterProperties = (props: ParameterPropertiesProps) =>{

    let handleChange = async (target: {name: string, checked: boolean})=>{
        await props.application.edit_parameters(props.parameter.parameter_id, target.name, target.checked);
        props.forceUpdate();
    }

    let handleonKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            await props.application.edit_parameters(props.parameter.parameter_id, event.currentTarget.name, event.currentTarget.value);
            props.forceUpdate();
        }
    }

    let handleRemove= async () =>{
        await props.application.remove_parameter(props.parameter.parameter_id);
        props.forceUpdate();
    }

    return(
        <Card
            name={props.parameter.parameter_name}
            onRemove={handleRemove}
            selector={{
                name:"visible",
                label:"Visible",
                click:handleChange,
                value:props.parameter.visible
            }}
        >
            <InputField inline id="parameter_name" name="parameter_name" defaultValue={props.parameter.parameter_name} onKeyDown={handleonKeyDown} label="Name"/>
            <InputField inline id="parameter_id" name='parameter_id' defaultValue={props.parameter.parameter_id} onKeyDown={handleonKeyDown} label="Parameter ID"/>
            <InputField inline id="trigger" name='trigger' defaultValue={props.parameter.trigger} onKeyDown={handleonKeyDown} label="Trigger"/>
            <InputField inline id="value" name='value' defaultValue={props.parameter.value.toString()} onKeyDown={handleonKeyDown} label="Value"/>
        </Card>
    );
};