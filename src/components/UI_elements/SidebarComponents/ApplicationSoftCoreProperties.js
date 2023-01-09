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
import {InputField} from "../InputField";

import {SelectField} from "../Select";
import {up_application} from "../../../client_core";
import {Card} from "../panels/Card";


export let  ApplicationSoftCoreProperties = props =>{

    let handleProgramChange = (event)=>{
        let app = new up_application(props.application);
        app.edit_soft_core(props.core.id,event.target.name, event.target.value).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let app = new up_application(props.application);
            app.edit_soft_core(props.core.id,event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemove= (event) =>{
        let app = new up_application(props.application);
            app.remove_soft_core(props.core.id).then(()=>{
            props.forceUpdate();
        });
    }


    let programs_list = Object.keys(props.programs).map((prog_id)=>{
        return props.programs[prog_id].name;
    })

    return(
        <Card
            name={props.core.id}
            onRemove={handleRemove}
        >
            <InputField inline ID="id" name="id" defaultValue={props.core.id} onKeyDown={handleonKeyDown} label="Core ID"/>
            <InputField inline ID="address" name='address' defaultValue={props.core.address} onKeyDown={handleonKeyDown} label="Address"/>
            <SelectField label="Default Program" onChange={handleProgramChange} defaultValue={props.core.default_program}
                         name="default_program" placeholder="Default Program" options={programs_list}/>
        </Card>
    );
};
