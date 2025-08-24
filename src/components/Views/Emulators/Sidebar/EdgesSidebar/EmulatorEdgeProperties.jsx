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

import {SimpleContent, UIPanel} from "@UI";
import DmaChannelsList from "./DmaChannelsList";
import DmaChannelProperties from "./DmaChannelProperties";

let  EmulatorEdgeProperties = props =>{

    const [selected_dma_channel, set_selected_dma_channel] = useState(null);

    let selected_component = null;
    let connections_list = []
    let selected_channel = {name:"", source:{channel:"", register:""}, destination:{channel:"", register: ""}};

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handle_select_dma = (sel) =>{
        set_selected_dma_channel(sel);
    }

    if(props.enabled && props.selected_emulator){
        selected_component = props.selected_emulator.connections.filter((item) => {
            return item.source_core === props.selected_component.obj.from && item.destination_core === props.selected_component.obj.to;
        })[0];

        connections_list = selected_component.ports.map((item) => {
            if(item) return item.id;
        });

        const source_core = props.selected_component.obj.from;
        const target_core = props.selected_component.obj.to;

        if(selected_dma_channel !== null){
            selected_channel = selected_component.ports.filter((item) =>{
                return item.id === selected_dma_channel;
            })[0];
            if(!selected_channel) {
                selected_channel = {name:"", source:{channel:"", register:""},source_output:"", destination:{channel:"", register: ""}, target_input:""};
            }
        }

        let render_dma_properties = () =>{
            if(selected_dma_channel !== null){
                return(<UIPanel key="channel_properties_tab" style={{maxHeight:"500px"}}  level="level_2">
                    <SimpleContent name={"DMA channel properties"} content={
                        <DmaChannelProperties
                            selected_emulator={props.selected_emulator}
                            selected_component={selected_component}
                            source_core={source_core}
                            target_core={target_core}
                            selected_channel={selected_channel}
                            on_channel_edit={handle_select_dma}
                        />
                    }/>
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
                    <SimpleContent name={"DMA channel properties"} content={
                        <DmaChannelsList
                            connections_list={connections_list}
                            selected_emulator={props.selected_emulator}
                            source_core={source_core}
                            target_core={target_core}
                            forceUpdate={forceUpdate}
                            selected_channel={selected_dma_channel}
                            on_select={handle_select_dma}
                            selected_component={props.selected_component}
                        />
                    }/>
                </UIPanel>
                {render_dma_properties()}
            </div>
        )

    }



};

export default EmulatorEdgeProperties;
