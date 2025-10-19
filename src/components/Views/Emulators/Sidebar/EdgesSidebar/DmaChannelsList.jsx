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

import {SelectableList} from "#UI";
import {MdAdd} from "react-icons/md";

let  DmaChannelsList = props =>{

    let handle_add = () =>{

        props.selected_emulator.add_port_link(props.source_core, props.target_core, props.connections_list.length).then(() =>{
            props.forceUpdate();
        });
    }

    let handle_remove = (removed_item) =>{
        props.selected_emulator.remove_link_id(props.source_core, props.target_core, removed_item).then(() =>{
            props.forceUpdate();
        });
    }

    let handle_select = (item) =>{
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
                items={props.connections_list}
                selected_item={props.selected_channel}
                onSelect={handle_select}
                onRemove={handle_remove}
            />
        </div>
    )

};

export default DmaChannelsList;
