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

import React, {useReducer} from 'react';

import {InputField, SelectField} from "@UI";
import { useSelector} from "react-redux";


let  DmaChannelProperties = props =>{

    const programs = useSelector(state => state.programs);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let source_program = Object.values(props.selected_emulator.cores).filter((c)=>{
        return c.id === props.selected_component.source;
    })[0].program;

    let target_program = Object.values(props.selected_emulator.cores).filter((c)=>{
        return c.id === props.selected_component.destination;
    })[0].program;

    let source_outputs = [];
    let source_memories = [];
    let target_inputs = [];
    if(source_program && target_program){
        source_outputs = Object.values(programs).filter((p)=>{
            return p.name === source_program;
        })[0].build_settings.io.outputs;
        source_memories = Object.values(programs).filter((p)=>{
            return p.name === source_program;
        })[0].build_settings.io.memories;
        if(source_outputs && source_memories){
            source_outputs = [...source_outputs, ...source_memories];
        } else if(source_memories){
            source_outputs = source_memories;
        }
        target_inputs = Object.values(programs).filter((p)=>{
            return p.name === target_program;
        })[0].build_settings.io.inputs;
        if(!target_inputs) target_inputs = [];
    }


    let handle_change = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            if(field.includes("source") || field.includes("destination")){
                let split_field = field.split("_");
                if(split_field[0] === 'source'){
                    value = props.selected_channel.source;
                    let raw_value = event.target.value.replace(/\s/g, '');
                    let value_tokens = raw_value.split(",");
                    value[split_field[1]] = value_tokens.map(val =>{
                        return parseInt(val);
                    });
                } else {
                    value = props.selected_channel.destination;
                    let raw_value = event.target.value.replace(/\s/g, '');
                    let value_tokens = raw_value.split(",");
                    value[split_field[1]] = value_tokens.map(val =>{
                        return parseInt(val);
                    });
                }
                field = split_field[0];
            }

            if(field === "length" || field === "stride"){
                value = parseInt(value);
            }

            props.selected_emulator.edit_dma_channel(props.source_core, props.target_core,
                field, value, props.selected_channel.name).then(()=>{
                if(field === 'name'){
                    props.on_channel_edit(props.on_channel_edit);
                }
                forceUpdate();
            });
        }
    }

    let handle_change_type = (value) =>{
        props.selected_emulator.edit_dma_channel(props.source_core, props.target_core,
            "type", value.value, props.selected_channel.name).then(()=>{
        });
    }

    let handle_change_source_out = (value) =>{
        props.selected_emulator.edit_dma_channel(props.source_core, props.target_core,
            "source_output", value.value, props.selected_channel.name).then(()=>{
            forceUpdate();
        });
    }

    let handle_change_target_in = (value) =>{
        props.selected_emulator.edit_dma_channel(props.source_core, props.target_core,
            "target_input", value.value, props.selected_channel.name).then(()=>{
            forceUpdate();
        });
    }

    return(
        <div key="dma_channel_props">
            <InputField id="name" name="name" label="Name" defaultValue={props.selected_channel.name} onKeyDown={handle_change}/>
            <SelectField
                inline
                label="Source Core Output"
                onChange={handle_change_source_out}
                value={{value: props.selected_channel.source_output , label: props.selected_channel.source_output}}
                defaultValue="Select Core output"
                name="source_output"
                options={source_outputs.map((outs)=>{
                    return {label:outs, value:outs};
                })}
            />
            <SelectField
                inline
                label="Target Core Input"
                onChange={handle_change_target_in}
                value={{value: props.selected_channel.target_input , label: props.selected_channel.target_input}}
                defaultValue="Select Core Input"
                name="target_input"
                options={target_inputs.map((ins)=>{
                    return {label:ins, value:ins};
                })}
            />
        </div>
    )

};

export default DmaChannelProperties;
