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

import {InputField, SelectField} from "@UI";
import {useAppSelector} from "#redux/hooks.js";

const efi_names = {
    efi_trig: "Trigonometry",
    efi_sort: "Sort",
    efi_rec: "Reciprocal"
}

let  EmulatorCoreProperties = props =>{

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
        if(programs[prog_id].type === "C") return {label:programs[prog_id].name, value:programs[prog_id].name};
    }).filter(item=>item)

    let handle_change = async (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;
            if(field === "program"){
                let comps = event.target.value.split(".");
                value = {filename: event.target.value, type:comps[1]}
            }
            if(field === "order" || field === "channels" || field === "sampling_frequency") value = parseInt(value);

            await props.selected_emulator.edit_core_props(props.selected_component.obj.id, field, value);
            props.bump_version();
        }
    }


    let handle_selection=(selection, event)=>{

        let field, value;
        if(event.name === "efi_implementation" || event.name === "comparators"){
            field = "options";
            value = props.selected_core.options;
            value[event.name] = selection.value;
        } else {
            field = "program"
            value = selection.value;
        }

        props.selected_emulator.edit_core_props(props.selected_component.obj.id, field, value).then(()=>{
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
            <InputField inline id="channels" name="channels" label="Channels #" defaultValue={props.selected_core.channels} onKeyDown={handle_change}/>
            <SelectField
                label="Program"
                onChange={handle_selection}
                value={selected_program}
                defaultValue="Select Program"
                name="program"
                placeholder="Program"
                options={programs_list}/>
            <InputField inline id="order" name="order" label="Execution Order" defaultValue={props.selected_core.order} onKeyDown={handle_change}/>
            <SelectField
                label="EFI"
                onChange={handle_selection}
                value={selected_efi}
                defaultValue="Select EFI"
                name="efi_implementation"
                placeholder="efi_implementation"
                options={[
                    {label: "Trigonometry", value: "efi_trig"},
                    {label: "Sort", value: "efi_sort"},
                    {label: "FP Reciprocal", value: "efi_rec"}
                ]}/>
            <SelectField
                label="Ccomparators"
                onChange={handle_selection}
                value={selected_comparators}
                defaultValue="Select Comparators"
                name="comparators"
                placeholder="comparators"
                options={[
                    {label: "full", value: "full"},
                    {label: "reducing", value: "reducing"},
                    {label: "none", value: "none"}
                ]}/>
            <InputField inline id="sampling_frequency" name="sampling_frequency" label="Sampling Frequency" defaultValue={props.selected_core.sampling_frequency} onKeyDown={handle_change}/>
        </div>
    );
};

export default EmulatorCoreProperties;
