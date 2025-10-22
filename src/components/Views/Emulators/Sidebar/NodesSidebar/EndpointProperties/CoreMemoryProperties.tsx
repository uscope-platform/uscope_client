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

import {Checkbox, InputField, SelectField, SimpleContent} from "#UI/index.js";
import TypeOptionsContainer from "./TypeOptionsContainer.jsx";
import {up_emulator} from "#client_core/index.js";
import type {
    core,
    core_memory,
    core_output,
    EmulatorComponentSelector,
    EmulatorIomSelector, SimpleStringOption
} from "#interfaces/index.js";

interface CoreMemoryPropertiesProps {
    selected_emulator:up_emulator,
    selected_component: EmulatorComponentSelector,
    selected_core: core,
    selected_iom: EmulatorIomSelector,
    on_modify: (iom: EmulatorIomSelector) => void
}


let  CoreMemoryProperties = (props: CoreMemoryPropertiesProps) =>{


    let handle_change_output = async (event: React.ChangeEvent<HTMLInputElement>)=>{

        let field = event.target.name;
        let value = event.target.checked;
        await props.selected_emulator.edit_memory(props.selected_component.obj.id,
            field as keyof core_memory, value, props.selected_iom.obj);
    }

    let handle_change_iom = async (event:React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.currentTarget.name;
            let value = event.currentTarget.value;

            if(field === "width" || field === "vector_size"){
                await props.selected_emulator.edit_memory(props.selected_component.obj.id, field, parseInt(value), props.selected_iom.obj);
            } else{
                await props.selected_emulator.edit_memory(props.selected_component.obj.id, field as keyof core_memory, value, props.selected_iom.obj);
            }

            if(field === 'name'){
                props.on_modify({type:props.selected_iom.type, obj:value});
            }
        }
    };

    let handle_change_type = async (change: SimpleStringOption | null) =>{
        if(change === null) return;
        await props.selected_emulator.edit_memory(props.selected_component.obj.id,
            "type", change.value, props.selected_iom.obj)
    }

    let sel_mem = props.selected_core.memory_init.filter((item)=>{
        return item.name === props.selected_iom.obj
    })[0];
    if(sel_mem=== undefined) return;

    let handle_change_signed = (event: React.ChangeEvent<HTMLInputElement>) =>{
        let field = event.target.name;
        let value = event.target.checked;

        props.selected_emulator.edit_memory(props.selected_component.obj.id, field as keyof core_memory, value, props.selected_iom.obj).then();
    }

    let render_type_options = () =>{
        let ret = [
            <SelectField<SimpleStringOption>
                label="Type"
                onChange={handle_change_type}
                value={{value: sel_mem.type, label: sel_mem.type}}
                name="type"
                options={[
                    {label: "float", value: "float"},
                    {label: "integer", value: "integer"}
                ]}
            />
        ];

        if(sel_mem.type==="integer"){
            ret.push(<InputField id="width" name="width" label="Input width" defaultValue={sel_mem.width.toString()} onKeyDown={handle_change_iom}/>);
            ret.push(<Checkbox name='signed' value={sel_mem.signed} onChange={handle_change_signed} label="Signed"/>);
        }

        ret.push(<Checkbox name='is_vector' value={sel_mem.is_vector} onChange={handle_change_signed} label="Is Vector"/>);
        if(sel_mem.is_vector){
            ret.push(<InputField id="vector_size" name="vector_size" label="Vector Size" defaultValue={sel_mem.vector_size.toString()} onKeyDown={handle_change_iom}/>);
        }

        return ret;
    }

    if(sel_mem){
        return(
            <SimpleContent name="Memory Properties">
                <div key="memory_props" style={{maxHeight:"13em"}}>
                    <InputField inline id="name" name="name" label="Name" defaultValue={sel_mem.name} onKeyDown={handle_change_iom}/>
                    <TypeOptionsContainer label="Memory Properties">
                        <InputField inline id="value" name="value" label="Value" defaultValue={sel_mem.value} onKeyDown={handle_change_iom}/>
                        <Checkbox name='is_output' value={sel_mem.is_output} onChange={handle_change_output} label="Use as Output"/>
                        <Checkbox name='is_input' value={sel_mem.is_input} onChange={handle_change_output} label="Use as Input"/>
                    </TypeOptionsContainer>
                    <TypeOptionsContainer label="Memory data format">
                        {render_type_options()}
                    </TypeOptionsContainer>
                </div>
            </SimpleContent>
        )
    }


};

export default CoreMemoryProperties;
