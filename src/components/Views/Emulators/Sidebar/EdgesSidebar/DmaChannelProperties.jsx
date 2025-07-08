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

import React, {useCallback, useReducer} from 'react';

import {InputField, SelectField} from "@UI";
import { useSelector} from "react-redux";


let  DmaChannelProperties = props =>{

    const programs = useSelector(state => state.programs);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let source_program = Object.values(props.selected_emulator.cores).filter((c)=>{
        return c.id === props.selected_component.source_core;
    })[0].program;

    let target_program = Object.values(props.selected_emulator.cores).filter((c)=>{
        return c.id === props.selected_component.destination_core;
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
