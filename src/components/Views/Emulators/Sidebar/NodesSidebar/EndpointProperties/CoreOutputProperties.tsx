/*
 * Copyright(c) 2025. Filippo Savi
 * Author: Filippo Savi <filssavi@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import React from 'react';

import {Checkbox, InputField, SelectField, SimpleContent} from "#UI/index.js";
import TypeOptionsContainer from "./TypeOptionsContainer.jsx";
import {up_emulator} from "#client_core/index.js";
import type {
    core,
    core_output,
    EmulatorComponentSelector,
    EmulatorIomSelector,
    SimpleStringOption
} from "#interfaces/index.js";
import type {ActionMeta} from "react-select";

interface CoreOutputPropertiesProps {
    selected_emulator:up_emulator,
    selected_component: EmulatorComponentSelector,
    selected_core: core,
    selected_iom: EmulatorIomSelector,
    on_modify: (iom: EmulatorIomSelector) => void
}



let  CoreOutputProperties = (props: CoreOutputPropertiesProps) =>{

    let sel_out = props.selected_core.outputs.filter((item)=>{
        return item.name === props.selected_iom.obj
    })[0];


    let handle_change_iom = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.currentTarget.name;
            let value = event.currentTarget.value;

            if(field === "width" || field === "vector_size"){
                await props.selected_emulator.edit_output(props.selected_component.obj.id, field, parseInt(value), props.selected_iom.obj);
            } else{
                await props.selected_emulator.edit_output(props.selected_component.obj.id, field as keyof core_output, value, props.selected_iom.obj);
            }
            if(field === 'name'){
                props.on_modify({type:props.selected_iom.type, obj:value});
            }
        }
    };

    let handle_select = async (object: SimpleStringOption | null, e: ActionMeta<SimpleStringOption>) =>{
        if(object === null) return;
        await props.selected_emulator.edit_output(props.selected_component.obj.id, e.name as keyof core_output, object.value, props.selected_iom.obj);
    }

    let handle_change_signed = async (event: React.ChangeEvent<HTMLInputElement>) =>{
        let field = event.target.name;
        let value = event.target.checked;

        await props.selected_emulator.edit_output(props.selected_component.obj.id,
            field as keyof core_output, value, props.selected_iom.obj);
    }
    if(sel_out=== undefined) return;
    let render_type_options = () =>{
        let ret = [
            <SelectField<SimpleStringOption>
                label="Type"
                onChange={handle_select}
                value={{value: sel_out.type, label: sel_out.type}}
                name="type"
                options={[
                    {label: "float", value: "float"},
                    {label: "integer", value: "integer"}
                ]}
            />
        ];

        if(sel_out.type==="integer"){
            ret.push(<InputField id="width" name="width" label="Input width" defaultValue={sel_out.width.toString()} onKeyDown={handle_change_iom}/>);
            ret.push(<Checkbox name='signed' value={sel_out.signed} onChange={handle_change_signed} label="Signed"/>);
        }

        ret.push(<Checkbox name='is_vector' value={sel_out.is_vector} onChange={handle_change_signed} label="Is Vector"/>);
        if(sel_out.is_vector){
            ret.push(<InputField id="vector_size" name="vector_size" label="Vector Size" defaultValue={sel_out.vector_size.toString()} onKeyDown={handle_change_iom}/>);
        }
        return ret;
    }

    if(sel_out){
        return(
            <SimpleContent name="Output Properties">
                <div key="output_props" style={{maxHeight:"13em"}}>
                    <InputField inline id="name" name="name" label="Name" defaultValue={sel_out.name} onKeyDown={handle_change_iom}/>
                    <TypeOptionsContainer label="Output data format">
                        {render_type_options()}
                    </TypeOptionsContainer>
                </div>
            </SimpleContent>
        )
    }


};

export default CoreOutputProperties;
