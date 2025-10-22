// Copyright 2023 Filippo Savi
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

import React, { useState} from 'react';

import {InputField, SelectField} from "#UI/index.js";
import {useAppSelector} from "#redux/hooks.js";
import {up_emulator} from "#client_core/index.js";
import type {EmulatorComponentSelector, core, SimpleStringOption, core_options} from "#interfaces/index.js";
import type {ActionMeta} from "react-select";

const efi_names = {
    efi_none: "None",
    efi_trig: "Trigonometry",
    efi_sort: "Sort",
    efi_rec: "Reciprocal"
}

interface EmulatorCorePropertiesProps {
    selected_core: core,
    selected_emulator: up_emulator,
    selected_component: EmulatorComponentSelector,
    bump_version: () => void,
}

let  EmulatorCoreProperties = (props: EmulatorCorePropertiesProps) =>{

    const programs = useAppSelector(state => state.programs);

    const [selected_program, set_selected_program] = useState({label:props.selected_core.program, value:props.selected_core.program});

    const [selected_efi, set_selected_efi] = useState(()=>{
        if(props.selected_core){
            return {label:efi_names[props.selected_core.options.efi_implementation], value:props.selected_core.options.efi_implementation};
        } else return {label: "", value:""};
    })
    const [selected_comparators, set_selected_comparators] = useState(()=>{
        if(props.selected_core){
            return {label:props.selected_core.options.comparators, value:props.selected_core.options.comparators};
        } else return {label: "", value:""};
    })

    let programs_list = Object.keys(programs).map((prog_id)=>{
        let p = programs[parseInt(prog_id)]
        if( p === undefined) return;
        if(p.type === "C") return {label:p.name, value:p.name};
    }).filter(item=>{ return item !== undefined;})

    let handle_change = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.currentTarget.name;
            let value = event.currentTarget.value;
            if(field === "order" || field === "channels" || field === "sampling_frequency") {
                await props.selected_emulator.edit_core_props(props.selected_component.obj.id, field as keyof core, parseInt(value));
            } else {
                await props.selected_emulator.edit_core_props(props.selected_component.obj.id, field as keyof core, value);
            }

            props.bump_version();
        }
    }


    let handle_selection=(selection: SimpleStringOption | null, event: ActionMeta<SimpleStringOption>)=>{
        if(selection === null) return;
        let field, value;
        if(event.name === "efi_implementation") {
            field = "options";
            value = props.selected_core.options;
            value["efi_implementation"] = selection.value as core_options["efi_implementation"] ;
        } else if(event.name === "comparators"){
            field = "options";
            value = props.selected_core.options;
            value["comparators"] = selection.value as core_options["comparators"];
        } else {
            field = "program"
            value = selection.value;
        }

        props.selected_emulator.edit_core_props(props.selected_component.obj.id, field as keyof core, value).then(()=>{
            if(event.name==="program"){
                set_selected_program(selection);
            } else if(event.name==="efi_implementation") {
                set_selected_efi(selection);
            } else if(event.name ==="comparators"){
                set_selected_comparators(selection);
            }

        });
    }

    return(
        <div key="node_props">
            <InputField inline id="name" name="name" label="Core Name" defaultValue={props.selected_core.name} onKeyDown={handle_change}/>
            <InputField inline id="channels" name="channels" label="Channels #" defaultValue={props.selected_core.channels.toString()} onKeyDown={handle_change}/>
            <SelectField
                label="Program"
                onChange={handle_selection}
                value={selected_program}
                name="program"
                options={programs_list}/>
            <InputField inline id="order" name="order" label="Execution Order" defaultValue={props.selected_core.order.toString()} onKeyDown={handle_change}/>
            <SelectField<SimpleStringOption>
                label="EFI"
                onChange={handle_selection}
                value={selected_efi}
                name="efi_implementation"
                options={[
                    {label: "Trigonometry", value: "efi_trig"},
                    {label: "Sort", value: "efi_sort"},
                    {label: "FP Reciprocal", value: "efi_rec"}
                ]}/>
            <SelectField<SimpleStringOption>
                label="Ccomparators"
                onChange={handle_selection}
                value={selected_comparators}
                name="comparators"
                options={[
                    {label: "full", value: "full"},
                    {label: "reducing", value: "reducing"},
                    {label: "none", value: "none"}
                ]}/>
            <InputField inline id="sampling_frequency" name="sampling_frequency" label="Sampling Frequency" defaultValue={props.selected_core.sampling_frequency.toString()} onKeyDown={handle_change}/>
        </div>
    );
};

export default EmulatorCoreProperties;
