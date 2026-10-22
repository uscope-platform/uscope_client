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

import React from 'react';

import {FieldGrid, FieldPane, FieldSpan, InputField, SelectField} from "#UI/index.js";
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

    // read from the core at every render: the panel is shared by all the cores, whichever is selected is shown
    const selected_program = {label: props.selected_core.program, value: props.selected_core.program};
    const selected_efi = {label: efi_names[props.selected_core.options.efi_implementation], value: props.selected_core.options.efi_implementation};
    const selected_comparators = {label: props.selected_core.options.comparators, value: props.selected_core.options.comparators};

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
        if(event.name === "efi_implementation" || event.name === "comparators"){
            field = "options";
            // a copy: the core must not change before the edit is saved
            value = {...props.selected_core.options, [event.name]: selection.value} as core_options;
        } else {
            field = "program"
            value = selection.value;
        }

        props.selected_emulator.edit_core_props(props.selected_component.obj.id, field as keyof core, value).then(()=>{
            props.bump_version();
        });
    }

    return(
        <FieldPane key="node_props">
            <FieldGrid>
                <FieldSpan>
                    <InputField id="name" name="name" label="Core name" defaultValue={props.selected_core.name} onKeyDown={handle_change}/>
                </FieldSpan>
                <InputField id="channels" name="channels" label="Channels #" defaultValue={props.selected_core.channels.toString()} onKeyDown={handle_change}/>
                <InputField id="order" name="order" label="Execution order" defaultValue={props.selected_core.order.toString()} onKeyDown={handle_change}/>
                <FieldSpan>
                    <SelectField
                        stacked
                        label="Program"
                        onChange={handle_selection}
                        value={selected_program}
                        name="program"
                        options={programs_list}/>
                </FieldSpan>
                <SelectField<SimpleStringOption>
                    stacked
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
                    stacked
                    label="Comparators"
                    onChange={handle_selection}
                    value={selected_comparators}
                    name="comparators"
                    options={[
                        {label: "full", value: "full"},
                        {label: "reducing", value: "reducing"},
                        {label: "none", value: "none"}
                    ]}/>
                <FieldSpan>
                    <InputField id="sampling_frequency" name="sampling_frequency" label="Sampling frequency" defaultValue={props.selected_core.sampling_frequency.toString()} onKeyDown={handle_change}/>
                </FieldSpan>
            </FieldGrid>
        </FieldPane>
    );
};

export default EmulatorCoreProperties;
