// Copyright 2021 University of Nottingham Ningbo China
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


import React, {useReducer, useState} from "react";
import {toast} from "react-toastify";

import {AddCard, ColorTheme, SelectableList, useListSelection} from "#UI/index.js";
import {up_emulator} from "#client_core/index.js";
import {error_text} from "#client_core/proxy/errors.js";
import DmaChannelProperties from "../Sidebar/EdgesSidebar/DmaChannelProperties.jsx";
import type {connection, EmulatorGraphEdge} from "#interfaces/index.js";

const NO_CONNECTION: connection = {source_core: -1, destination_core: -1, ports: []};

interface EdgeChannelsProps {
    emulator: up_emulator,
    edge: EmulatorGraphEdge,
    // changes when the emulator was edited, for what is drawn from it to be drawn again
    revision: number,
}

/// The DMA channels of the connection that is selected in the diagram, as the inputs, outputs and memory of a core are:
/// the list of them, and the properties of the selected one beside it
export const EdgeChannels = (props: EdgeChannelsProps) =>{
    const {emulator, edge} = props;

    const [channel_id, set_channel_id] = useState(-1);
    // the channels are edited in place, this draws them again after an edit
    const [edits, force_update] = useReducer((x: number) => x + 1, 0);
    const [multi_count, set_multi_count] = useState(0);
    const selection = useListSelection(edge.from + "-" + edge.to, (names) => set_multi_count(names.length));

    // another edge, another list: the revision and the edits of the channels are what make it be read again
    const connection = find_connection(emulator, edge, props.revision + edits);
    const channel = connection.ports.find((port) => port.id === channel_id);

    const run = async (change: Promise<unknown>) =>{
        try{
            await change;
            force_update();
        } catch (err) {
            toast.error(error_text(err));
        }
    };

    let handle_select = (name: string) =>{
        selection.clear();
        set_channel_id(parseInt(name));
    };

    let handle_add = () =>{
        // after the biggest id: the length of the list is the id of an existing channel once one in the middle was removed
        const new_id = Math.max(-1, ...connection.ports.map((port) => port.id)) + 1;
        run(emulator.add_port_link(edge.from, edge.to, new_id)).then(() => set_channel_id(new_id));
    };

    let handle_remove = async (name: string) =>{
        await run(emulator.remove_link_id(edge.from, edge.to, parseInt(name)));
        if(parseInt(name) === channel_id) set_channel_id(-1);
    };

    let remove_many = async (removed: string[]) =>{
        for(const name of removed) await run(emulator.remove_link_id(edge.from, edge.to, parseInt(name)));
        set_channel_id(-1);
    };

    return(
        <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
            <div style={{flex: "0 0 14em", overflowY: "auto", overflowX: "hidden", background: ColorTheme.background.level_3}}>
                <div style={{maxHeight: "13em"}}>
                    <AddCard label="Add channel" onClick={handle_add}/>
                    <SelectableList
                        style={{width: "auto"}}
                        items={connection.ports.map((port) => port.id.toString())}
                        descriptions={connection.ports.map((port) => port.source_port + " → " + port.destination_port)}
                        selected_item={channel_id.toString()}
                        onSelect={handle_select}
                        {...(selection.many ? {selection: selection.many} : {})}
                        onSelectionChange={(changed) => selection.change(changed, handle_select)}
                        onRemoveMany={remove_many}
                        onRemove={handle_remove}
                    />
                </div>
            </div>
            <div style={{flex: 1, minWidth: 0, overflow: "auto"}}>
                {multi_count > 1
                    ? <div style={{padding: "1em", textAlign: "center", fontStyle: "italic", color: "var(--text-secondary)"}}>
                        {multi_count} items selected. Right click one of them for what can be done to all of them.
                    </div>
                    : channel !== undefined
                        ? <DmaChannelProperties
                            selected_emulator={emulator}
                            selected_connection={connection}
                            source_core={edge.from}
                            target_core={edge.to}
                            selected_channel={channel}
                            forceUpdate={force_update}
                        />
                        : <div style={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "1em", textAlign: "center", fontStyle: "italic", color: "var(--text-secondary)"}}>
                            {connection.ports.length === 0 ? "This connection has no channels: add one" : "Select an item to edit it"}
                        </div>
                }
            </div>
        </div>
    );
};

// the connection of the edge, read from the emulator; the revision is only what makes it be read again
const find_connection = (emulator: up_emulator, edge: EmulatorGraphEdge, _revision: number): connection =>
    emulator.connections.find((c) => c.source_core === edge.from && c.destination_core === edge.to) ?? NO_CONNECTION;
