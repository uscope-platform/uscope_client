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

import {SelectField} from "@UI";


let  DmaChannelProperties = props =>{


    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let source_core = Object.values(props.selected_emulator.cores).filter((c)=>{
        return c.id === props.selected_component.source_core;
    })[0];

    let target_core = Object.values(props.selected_emulator.cores).filter((c)=>{
        return c.id === props.selected_component.destination_core;
    })[0];

    let source_outputs = [];
    let source_memories = [];
    let target_inputs = [];
    let target_memories = [];
    if(source_core && target_core){


        source_outputs = source_core.outputs.map((out)=> out.name);
        source_memories = source_core.memory_init.map((mem)=> mem.name);

        if(source_outputs && source_memories){
            source_outputs = [...source_outputs, ...source_memories];
        } else if(source_memories){
            source_outputs = source_memories;
        }

        target_inputs = target_core.inputs.map((in_obj)=> in_obj.name);
        target_memories = target_core.memory_init.map((mem)=> {
            if(mem.is_input){
                return mem.name;
            }
        });

        if(target_inputs && target_memories){
            target_inputs = [...target_inputs, ...target_memories];
        } else if(target_memories){
            target_inputs = target_memories;
        }
    }


    let handle_change_source_out = (value) =>{
        let id = props.selected_channel.id;
        props.selected_emulator.edit_port_link(
            props.source_core,
            props.target_core,
            "source_port",
            value.value,
            id
        ).then(()=>{
            forceUpdate();
        });
    }

    let handle_change_target_in = (value) =>{
        let id = props.selected_channel.id;
        props.selected_emulator.edit_port_link(
            props.source_core,
            props.target_core,
            "destination_port",
            value.value,
            id
        ).then(()=>{
            forceUpdate();
        });
    }

    return(
        <div key="dma_channel_props">
            <SelectField
                inline
                label="Source Core Output"
                onChange={handle_change_source_out}
                value={{value: props.selected_channel.source_port , label: props.selected_channel.source_port}}
                defaultValue="Select Core output"
                name="source_port"
                options={source_outputs.map((outs)=>{
                    return {label:outs, value:outs};
                })}
            />
            <SelectField
                inline
                label="Target Core Input"
                onChange={handle_change_target_in}
                value={{value: props.selected_channel.destination_port , label: props.selected_channel.destination_port}}
                defaultValue="Select Core Input"
                name="destination_port"
                options={target_inputs.map((ins)=>{
                    return {label:ins, value:ins};
                })}
            />
        </div>
    )

};

export default DmaChannelProperties;
