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
    SelectField,
    Card
} from "../../../UI_elements";

import {up_application} from "../../../../client_core";
import {CoreDmaIo} from "./CoreDmaIo";


export let  SoftCoreProperties = props =>{


    let programs_list = Object.keys(props.programs).map((prog_id)=>{
        return {label:props.programs[prog_id].name, value:props.programs[prog_id].name};
    })

    let init_value = props.core.default_program ? {label:props.core.default_program, value:props.core.default_program} : undefined;

    const [selected, set_selected] = useState(init_value);



    let handleProgramChange = (event)=>{
        set_selected(event);
        let app = new up_application(props.application);
        app.edit_soft_core(props.core.id,"default_program", event.value).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let app = new up_application(props.application);
            let field = event.target.name;
            let value = event.target.value;
            if(field==="address") value = parseInt(value);
            app.edit_soft_core(props.core.id, field, value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemove= () =>{
        let app = new up_application(props.application);
            app.remove_soft_core(props.core.id).then(()=>{
            props.forceUpdate();
        });
    }


    return(
        <Card
            name={props.core.id}
            onRemove={handleRemove}
        >
            <InputField inline id="id" name="id" defaultValue={props.core.id} onKeyDown={handleonKeyDown} label="Core ID"/>
            <InputField inline id="address" name='address' defaultValue={props.core.address} onKeyDown={handleonKeyDown} label="Address"/>
            <SelectField
                label="Default Program"
                onChange={handleProgramChange}
                value={selected}
                defaultValue="Select Program"
                name="default_program"
                placeholder="Default Program"
                options={programs_list}/>
            <CoreDmaIo
                forceUpdate={props.forceUpdate}
                application={props.application}
                core={props.core}
            />
        </Card>
    );
};