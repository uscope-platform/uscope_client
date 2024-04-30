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
import {InputField} from "../../InputField";

import {up_application} from "../../../../client_core";
import {Card} from "../../panels/Card";

export let  MiscFieldProperties = props =>{



    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let app = new up_application(props.application);
            app.edit_misc_param(props.name,event.target.value, event.target.name==="name").then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemove = (event) =>{
        let app = new up_application(props.application);
        app.remove_misc_field(props.name).then(()=>{
            props.forceUpdate();
        });
        props.forceUpdate();
    }


    return(
        <Card
            name={props.name}
            onRemove={handleRemove}
        >
            <InputField inline ID="name" name="name" defaultValue={props.name} onKeyDown={handleonKeyDown} label="Name"/>
            <InputField inline ID="value"  name='value' defaultValue={props.value} onKeyDown={handleonKeyDown} label="Value"/>
        </Card>
    );
};