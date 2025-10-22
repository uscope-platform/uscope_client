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

import {SelectableList} from "#UI/index.js";
import {MdAdd} from "react-icons/md";
import {up_emulator} from "#client_core/index.js";
import type {port_link} from "#interfaces/index.js";

interface DmaChannelsListProps {
    source_core: number;
    target_core: number;
    selected_emulator: up_emulator;
    forceUpdate: () => void;
    connections_list: number[];
    selected_channel: number;
    on_select: (item: string) => void;
}

let  DmaChannelsList = (props: DmaChannelsListProps) =>{

    let handle_add = () =>{

        props.selected_emulator.add_port_link(props.source_core, props.target_core, props.connections_list.length).then(() =>{
            props.forceUpdate();
        });
    }

    let handle_remove = (removed_item: string) =>{
        props.selected_emulator.remove_link_id(props.source_core, props.target_core, parseInt(removed_item)).then(() =>{
            props.forceUpdate();
        });
    }

    let handle_select = (item: string) =>{
        props.on_select(item);
    }

    return(
        <div key="edge_props">
            <div style={{
                display:"flex",
                flexDirection:"row",
                marginTop:"0.25em"
            }}>
                <MdAdd style={{marginLeft:"auto"}} onClick={handle_add}/>
            </div>
            <SelectableList
                items={props.connections_list.map(val => val.toString())}
                selected_item={props.selected_channel.toString()}
                onSelect={handle_select}
                onRemove={handle_remove}
            />
        </div>
    )

};

export default DmaChannelsList;
