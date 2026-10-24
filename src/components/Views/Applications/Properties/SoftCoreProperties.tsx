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
import {Card, FormLayout, InputField, SelectField} from "#UI/index.js";

import {up_application} from "#client_core/index.js";
import {CoreDmaIo} from "./CoreDmaIo.jsx";
import type {soft_core} from "#interfaces/index.js";
import type {ProgramState, SimpleStringOption} from "#interfaces/index.js";


interface SoftCorePropertiesProps {
    application: up_application,
    core: soft_core,
    programs: ProgramState,
    forceUpdate: ()=>void,
}


export let  SoftCoreProperties = (props: SoftCorePropertiesProps) =>{


    let programs_list = (): SimpleStringOption[] =>{
        return Object.keys(props.programs).map((prog_id: string) => {
            let program = props.programs[parseInt(prog_id)];
            if (program !== undefined) return {label: program.name, value: program.name};
        }).flat().filter((opt: SimpleStringOption | undefined) => {
            return opt !== undefined;
        });
    };

    // what the application has, not a copy of it: it changes when the core is edited from elsewhere
    const selected: SimpleStringOption = props.core.default_program ?
        {label:props.core.default_program, value:props.core.default_program} : {label: "None", value: "None"};

    let handleProgramChange = (option: SimpleStringOption| null)=>{
        if(option === null) return;
        props.application.edit_soft_core(props.core.id,"default_program", option.value).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let field = event.currentTarget.name;
            let value = event.currentTarget.value;
            await props.application.edit_soft_core(props.core.id, field, field === "address" ? value : parseInt(value));
            props.forceUpdate();
        }
    }

    return(
        <Card style={{width: "100%", paddingLeft: 0}}>
            <FormLayout columns="10.5rem">
                <InputField id="address" name='address' defaultValue={props.core.address.toString()} onKeyDown={handleonKeyDown} label="Address"/>
                <SelectField<SimpleStringOption>
                    stacked
                    label="Default Program"
                    onChange={handleProgramChange}
                    value={selected}
                    name="default_program"
                    options={programs_list()}/>
            </FormLayout>
            <CoreDmaIo
                forceUpdate={props.forceUpdate}
                application={props.application}
                core={props.core}
            />
        </Card>
    );
};