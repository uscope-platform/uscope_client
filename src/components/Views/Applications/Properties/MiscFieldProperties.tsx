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
    FormLayout,
    Card
} from "#UI/index.js";

import {up_application} from "#client_core/index.js";

interface MiscFieldProperties {
    application: up_application,
    forceUpdate: ()=>void,
    name: string,
    value: string,
}

export let  MiscFieldProperties = (props: MiscFieldProperties) =>{



    let handleonKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            await props.application.edit_misc_param(props.name, event.currentTarget.value, false);
            props.forceUpdate();
        }
    }

    return(
        <Card style={{width: "100%", paddingLeft: 0}}>
            <FormLayout columns="10.5rem">
                <InputField id="value" name='value' defaultValue={props.value} onKeyDown={handleonKeyDown} label="Value"/>
            </FormLayout>
        </Card>
    );
};