// Copyright 2026 Filippo Savi
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

import {SidebarColumn} from "#UI/index.js";
import {up_emulator} from "#client_core/index.js";
import EmulatorList from "../EmulatorList.jsx";
import DmaChannelsList from "./DmaChannelsList.jsx";
import DmaChannelProperties from "./DmaChannelProperties.jsx";
import type {connection, EmulatorGraphEdge} from "#interfaces/index.js";

const NO_CONNECTION: connection = {source_core: -1, destination_core: -1, ports: []};

interface EdgeSidebarProps {
    emulator: up_emulator,
    edge: EmulatorGraphEdge,
    on_select_emulator: (emulator: number) => void,
}

/// The sidebar of the editor when an edge is selected. The channel that is edited is picked in the list of the edge,
/// so it is kept here, and it starts over for another edge: give the edge as the key.
let EdgeSidebar = (props: EdgeSidebarProps) =>{
    const [channel_id, set_channel_id] = useState(-1);
    const [, force_update] = useReducer(x => x + 1, 0);

    const edge = props.edge;
    const connection = props.emulator.connections.find((c) => c.source_core === edge.from && c.destination_core === edge.to) ?? NO_CONNECTION;
    const channel = connection.ports.find((port) => port.id === channel_id);

    return(
        <SidebarColumn
            style={{padding: "10px 0"}}
            panels={[
                {title: "Emulator List", content: <EmulatorList on_select={props.on_select_emulator}/>},
                {title: "DMA channels", min_height: "200px", content: (
                    <DmaChannelsList
                        connections_list={connection.ports.map((port) => port.id)}
                        selected_emulator={props.emulator}
                        source_core={edge.from}
                        target_core={edge.to}
                        forceUpdate={force_update}
                        selected_channel={channel_id}
                        on_select={(item) => set_channel_id(parseInt(item))}
                    />
                )},
                ...(channel ? [{title: "DMA channel properties", content: (
                    <DmaChannelProperties
                        selected_emulator={props.emulator}
                        selected_connection={connection}
                        source_core={edge.from}
                        target_core={edge.to}
                        selected_channel={channel}
                        forceUpdate={force_update}
                    />
                )}] : [])
            ]}
        />
    );
};

export default EdgeSidebar;
