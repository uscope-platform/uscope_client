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

import {Checkbox, InputField, SelectField, SimpleContent} from "@UI";

let  CoreMemoryProperties = props =>{


    let handle_change_output = (event)=>{

        let field = event.target.name;
        let value = event.target.checked;
        props.selected_emulator.edit_memory(props.selected_component.obj.id,
            field, value, props.selected_iom.obj);
    }

    let handle_change_iom = async (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            if(field === "width" || field === "vector_size"){
                value = parseInt(value);
            }

            await props.selected_emulator.edit_memory(props.selected_component.obj.id, field, value, props.selected_iom.obj)
            if(field === 'name'){
                props.on_modify({type:props.selected_iom.type, obj:value});
            }
        }
    };

    let handle_change_type = (event) =>{
        props.selected_emulator.edit_memory(props.selected_component.obj.id,
            "type", event.value, props.selected_iom.obj)
    }

    let sel_mem = props.selected_core.memory_init.filter((item)=>{
        return item.name === props.selected_iom.obj
    })[0];


    let handle_change_signed = (event) =>{
        let field = event.target.name;
        let value = event.target.checked;

        props.selected_emulator.edit_memory(props.selected_component.obj.id,
            field, value, props.selected_iom.obj);
    }

    let render_type_options = () =>{
        let ret = [
            <SelectField
                inline
                label="Type"
                onChange={handle_change_type}
                value={{value: sel_mem.type, label: sel_mem.type}}
                defaultValue="Select Type"
                name="type"
                options={[
                    {label: "float", value: "float"},
                    {label: "integer", value: "integer"}
                ]}
            />
        ];

        if(sel_mem.type==="integer"){
            ret.push(<InputField id="width" name="width" label="Input width" defaultValue={sel_mem.width} onKeyDown={handle_change_iom}/>);
            ret.push(<Checkbox name='signed' value={sel_mem.signed} onChange={handle_change_signed} label="Signed"/>);
        }

        ret.push(<Checkbox name='is_vector' value={sel_mem.is_vector} onChange={handle_change_signed} label="Is Vector"/>);
        if(sel_mem.is_vector){
            ret.push(<InputField id="vector_size" name="vector_size" label="Vector Size" defaultValue={sel_mem.vector_size} onKeyDown={handle_change_iom}/>);
        }

        return ret;
    }

    if(sel_mem){
        return(
            <SimpleContent name="Memory Properties" content={
                <div key="memory_props" style={{maxHeight:"13em"}}>
                    <InputField inline id="name" name="name" label="Name" defaultValue={sel_mem.name} onKeyDown={handle_change_iom}/>
                    {render_type_options()}
                    <InputField inline id="value" name="value" label="Value" defaultValue={sel_mem.value} onKeyDown={handle_change_iom}/>
                    <Checkbox name='is_output' value={sel_mem.is_output} onChange={handle_change_output} label="Use as Output"/>
                    <Checkbox name='is_input' value={sel_mem.is_input} onChange={handle_change_output} label="Use as Input"/>
                </div>
            }/>
        )
    }


};

export default CoreMemoryProperties;
