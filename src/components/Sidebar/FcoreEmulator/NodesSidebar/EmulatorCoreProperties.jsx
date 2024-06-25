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

import {InputField, SelectField} from "../../../UI_elements";
import {useSelector} from "react-redux";

let  EmulatorCoreProperties = props =>{

    const programs = useSelector(state => state.programs);
    const settings = useSelector(state => state.settings);

    const [selected_program, set_selected_program] = useState({label:props.selected_core.program, value:props.selected_core.program});

    let programs_list = Object.keys(programs).map((prog_id)=>{
        return {label:programs[prog_id].name, value:programs[prog_id].name};
    })

    let handle_change = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;
            if(field === "program"){
                let comps = event.target.value.split(".");
                value = {filename: event.target.value, type:comps[1]}
            }
            if(field === "order" || field === "channels" || field === "sampling_frequency") value = parseInt(value);
            if(field==="efi_implementation"||field==="comparators"){
                value = props.selected_core.options;
                value[field] = event.target.value;
                field = "options";
            }
            props.selected_emulator.edit_core_props(props.selected_component.obj.id, field, value).then();
        }
    }


    let handle_program_change=(prog)=>{
        props.selected_emulator.edit_core_props(props.selected_component.obj.id, "program", prog.value).then(()=>{
            set_selected_program(prog);
        });
    }

    return(
        <div key="node_props">
            <InputField inline ID="name" name="name" label="Core Name" defaultValue={props.selected_core.name} onKeyDown={handle_change}/>
            <InputField inline ID="channels" name="channels" label="Channels #" defaultValue={props.selected_core.channels} onKeyDown={handle_change}/>
            <SelectField
                label="Program"
                onChange={handle_program_change}
                value={selected_program}
                defaultValue="Select Program"
                name="program"
                placeholder="Program"
                options={programs_list}/>
            <InputField inline ID="order" name="order" label="Execution Order" defaultValue={props.selected_core.order} onKeyDown={handle_change}/>
            <InputField inline ID="efi_implementation" name="efi_implementation" label="EFI" defaultValue={props.selected_core.options.efi_implementation} onKeyDown={handle_change}/>
            <InputField inline ID="comparators" name="comparators" label="comparators" defaultValue={props.selected_core.options.comparators} onKeyDown={handle_change}/>
            <InputField inline ID="sampling_frequency" name="sampling_frequency" label="Sampling Frequency" defaultValue={props.selected_core.sampling_frequency} onKeyDown={handle_change}/>
        </div>
    );
};

export default EmulatorCoreProperties;
