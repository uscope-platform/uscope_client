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

import
    React, {useReducer} from 'react';

import {InputField, SelectField} from "#UI/index.js";
import {up_emulator} from "#client_core/index.js";
import type {connection, port_link, SimpleStringOption} from "#interfaces/index.js";
import type {} from "#UI/Select.js";

interface DmaChannelPropertiesProps {
    selected_emulator: up_emulator,
    selected_connection: connection,
    source_core: number,
    target_core: number,
    on_channel_edit: (channel:string) => void,
    selected_channel: port_link
}

let  DmaChannelProperties = (props: DmaChannelPropertiesProps) =>{


    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let source_core = Object.values(props.selected_emulator.cores).filter((c)=>{
        return c.id === props.selected_connection.source_core;
    })[0];

    let target_core = Object.values(props.selected_emulator.cores).filter((c)=>{
        return c.id === props.selected_connection.destination_core;
    })[0];

    let source_outputs: string[] = [];
    let source_memories = [];
    let target_inputs: string[] = [];
    let target_memories: string[] = [];
    let enable_partial_channels = false;
    if(source_core && target_core){
        let source_endpoint = source_core.memory_init.filter((mem)=>{return mem.name ===  props.selected_channel.source_port})[0];
        let dest_endpoint = target_core.memory_init.filter((mem)=> {return mem.name === props.selected_channel.destination_port})[0];
        if(source_endpoint && dest_endpoint && source_core.id === target_core.id){
            if(source_endpoint.is_input && dest_endpoint.is_output){
                enable_partial_channels = true;
            }
        }
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
        }).filter((mem)=> {return mem !== undefined});

        if(target_inputs && target_memories){
            target_inputs = [...target_inputs, ...target_memories];
        } else if(target_memories){
            target_inputs = target_memories;
        }
    }


    let handle_change_source_out = (value: SimpleStringOption | null) =>{
        if(value === null) return;
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

    let handle_change_target_in =async (value: SimpleStringOption | null) =>{
        if(value === null) return;
        await props.selected_emulator.edit_port_link(
            props.source_core,
            props.target_core,
            "destination_port",
            value.value,
            props.selected_channel.id
        );
        forceUpdate();
    }

    let handle_change_partial_channels = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.currentTarget.name;
            let value = parseInt(event.currentTarget.value);
            await  props.selected_emulator.edit_port_link(
                props.source_core,
                props.target_core,
                field as keyof port_link,
                value,
                props.selected_channel.id
            );
            forceUpdate();
        }
    }

    let render_partial_channels = () =>{
        if(enable_partial_channels){
            return(
                <>
                    <InputField inline id="source_channel" name="source_channel" label="Source Channel" defaultValue={props.selected_channel.source_channel.toString()} onKeyDown={handle_change_partial_channels}/>
                    <InputField inline id="destination_channel" name="destination_channel" label="Destination Channel" defaultValue={props.selected_channel.destination_channel.toString()} onKeyDown={handle_change_partial_channels}/>
                </>
            )
        }
    }

    return(
        <div key="dma_channel_props">
            <SelectField<SimpleStringOption>
                label="Source Core Output"
                onChange={handle_change_source_out}
                value={{value: props.selected_channel.source_port , label: props.selected_channel.source_port}}
                name="source_port"
                options={source_outputs.map((outs)=>{
                    return {label:outs, value:outs};
                })}
            />
            <SelectField<SimpleStringOption>
                label="Target Core Input"
                onChange={handle_change_target_in}
                value={{value: props.selected_channel.destination_port , label: props.selected_channel.destination_port}}
                name="destination_port"
                options={target_inputs.map((ins)=>{
                    return {label:ins, value:ins};
                })}
            />
            {render_partial_channels()}
        </div>
    )

};

export default DmaChannelProperties;
