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
} from "#UI";

import {up_application} from "#client_core";


export let  MacroProperties = props =>{

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let app = new up_application(props.application);
            app.edit_macro(props.macro.name, event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemove= (event) =>{
        let app = new up_application(props.application);
        app.remove_macro(props.macro.name).then(()=>{
            props.forceUpdate();
        });
    }


    return(
        <Card
            name={props.macro.name}
            onRemove={handleRemove}
        >
            <InputField inline id='name' name='name' defaultValue={props.macro.name} onKeyDown={handleonKeyDown} label="Name"/>
            <InputField inline id='trigger'  name='trigger' defaultValue={props.macro.trigger} onKeyDown={handleonKeyDown} label="Trigger"/>
        </Card>
    );
};
