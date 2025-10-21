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
import type {initial_register_value} from "#interfaces/index.js";

interface InitialRegisterValueProps{
    application: up_application,
    forceUpdate: ()=>void,
    irv: initial_register_value
}

export let  InitialRegisterValue = (props: InitialRegisterValueProps) =>{


    let handleonKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            await props.application.edit_irv(props.irv.address,event.currentTarget.name, parseInt(event.currentTarget.value));
            props.forceUpdate();
        }
    }

    let handleRemove= async () =>{
        await props.application.remove_irv(props.irv.address);
        props.forceUpdate();
    }



    return(
        <Card
            name={props.irv.address.toString()}
            onRemove={handleRemove}
        >
            <InputField inline id="address" name="address" defaultValue={props.irv.address.toString()} onKeyDown={handleonKeyDown} label="Address"/>
            <InputField inline id="value" name='value' defaultValue={props.irv.value.toString()} onKeyDown={handleonKeyDown} label="Value"/>
        </Card>
    );
};