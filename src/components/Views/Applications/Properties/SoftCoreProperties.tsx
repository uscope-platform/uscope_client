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
import {Card, InputField, SelectField} from "#UI/index.js";

import {up_application} from "#client_core/index.js";
import {CoreDmaIo} from "./CoreDmaIo.jsx";
import type {soft_core} from "#interfaces/index.js";
import type {ProgramState} from "#interfaces/redux.js";

interface SoftCorePropertiesProps {
    application: up_application,
    core: soft_core,
    programs: ProgramState,
    forceUpdate: ()=>void,
}

interface ProgramSelectOption{
    label: string,
    value: string
}

export let  SoftCoreProperties = (props: SoftCorePropertiesProps) =>{


    let programs_list = (): ProgramSelectOption[] =>{
        return Object.keys(props.programs).map((prog_id: string) => {
            let program = props.programs[parseInt(prog_id)];
            if (program !== undefined) return {label: program.name, value: program.name};
        }).flat().filter((opt: ProgramSelectOption | undefined) => {
            return opt !== undefined;
        });
    };

    let init_value = props.core.default_program ?
        {label:props.core.default_program, value:props.core.default_program} : {label: "None", value: "None"};

    const [selected, set_selected] = useState(init_value);



    let handleProgramChange = (option: ProgramSelectOption| null)=>{
        if(option === null) return;
        set_selected(option);
        props.application.edit_soft_core(props.core.id,"default_program", option.value).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let field = event.currentTarget.name;
            let value = event.currentTarget.value;
            if(field==="address") {
                await props.application.edit_soft_core(props.core.id, field, value);
            } else {
                await props.application.edit_soft_core(props.core.id, field, parseInt(value));
            }
            props.forceUpdate();
        }
    }

    let handleRemove= async () =>{
        await props.application.remove_soft_core(props.core.id);
        props.forceUpdate();
    }



    return(
        <Card
            name={props.core.id}
            onRemove={handleRemove}
        >
            <InputField inline id="id" name="id" defaultValue={props.core.id} onKeyDown={handleonKeyDown} label="Core ID"/>
            <InputField inline id="address" name='address' defaultValue={props.core.address.toString()} onKeyDown={handleonKeyDown} label="Address"/>
            <SelectField<ProgramSelectOption>
                label="Default Program"
                onChange={handleProgramChange}
                value={selected}
                name="default_program"
                options={programs_list()}/>
            <CoreDmaIo
                forceUpdate={props.forceUpdate}
                application={props.application}
                core={props.core}
            />
        </Card>
    );
};