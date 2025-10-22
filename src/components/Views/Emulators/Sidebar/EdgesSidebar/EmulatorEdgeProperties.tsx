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

import React, {useReducer, useState} from 'react';

import {SimpleContent, UIPanel} from "#UI/index.js";
import DmaChannelsList from "./DmaChannelsList.jsx";
import DmaChannelProperties from "./DmaChannelProperties.jsx";
import {up_emulator} from "#client_core/index.js";
import type {connection, EmulatorComponentSelector, port_link} from "#interfaces/index.js";

interface EmulatorEdgePropertiesProps {
    enabled: boolean,
    selected_emulator: up_emulator,
    selected_component: EmulatorComponentSelector | null,

}
const null_link: port_link = {id:9999, source_port:"", destination_port:"", source_channel: -1, destination_channel: -1}
const null_connection: connection = {source_core: -1, destination_core: -1, ports: []}
let  EmulatorEdgeProperties = (props: EmulatorEdgePropertiesProps) =>{

    const [selected_dma_channel, set_selected_dma_channel] = useState(0);

    let selected_connection : connection  = null_connection;
    let connections_list: number[] = []
    let selected_channel: port_link  = null_link;

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handle_select_dma = (sel: string) =>{
        set_selected_dma_channel(parseInt(sel));
    }

    if(props.enabled && props.selected_emulator){
        let selected_component = props.selected_component;
        if(!selected_component || selected_component.type === "node") return;

        let c =  props.selected_emulator.connections.filter((item) => {
            return item.source_core === selected_component.obj.from && item.destination_core === selected_component.obj.to;
        })[0];
        if(c === undefined) selected_connection = null_connection;
        else selected_connection = c

        connections_list = selected_connection.ports.map((item) => {
            if(item) return item.id;
        }).filter((conn)=> {return conn !== undefined;});

        const source_core = selected_component.obj.from;
        const target_core = selected_component.obj.to;

        if(selected_dma_channel !== null){
            let c= selected_connection.ports.filter((item) =>{
                return item.id === selected_dma_channel;
            })[0];
            if(c === undefined) selected_channel = null_link;
            else selected_channel = c;
        }

        let render_dma_properties = () =>{
            if(selected_dma_channel !== null && selected_connection !== undefined){
                return(<UIPanel key="channel_properties_tab" style={{maxHeight:"500px"}}  level="level_2">
                    <SimpleContent name={"DMA channel properties"}>
                        <DmaChannelProperties
                            selected_emulator={props.selected_emulator}
                            selected_connection={selected_connection}
                            source_core={source_core}
                            target_core={target_core}
                            selected_channel={selected_channel}
                            on_channel_edit={handle_select_dma}
                        />
                    </SimpleContent>
                </UIPanel>)
            }
        }

        return(
            <div style={{
                display:"flex",
                flexDirection:"column",
                gap:10,
                margin:10
            }}>
                <UIPanel key="channels_list" style={{minHeight:"200px"}} level="level_2">
                    <SimpleContent name={"DMA channel properties"}>
                        <DmaChannelsList
                            connections_list={connections_list}
                            selected_emulator={props.selected_emulator}
                            source_core={source_core}
                            target_core={target_core}
                            forceUpdate={forceUpdate}
                            selected_channel={selected_dma_channel}
                            on_select={handle_select_dma}
                        />
                    </SimpleContent>
                </UIPanel>
                {render_dma_properties()}
            </div>
        )

    }



};

export default EmulatorEdgeProperties;
