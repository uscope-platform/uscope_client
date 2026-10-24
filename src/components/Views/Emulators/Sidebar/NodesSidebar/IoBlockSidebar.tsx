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

import React from 'react';

import {SidebarColumn} from "#UI/index.js";
import {up_emulator} from "#client_core/index.js";
import EmulatorList from "../EmulatorList.jsx";
import {IoBlockFields} from "./IoBlockProperties.jsx";
import type {io_block} from "#interfaces/index.js";

interface IoBlockSidebarProps {
    emulator: up_emulator,
    block: io_block,
    on_select_emulator: (emulator: number) => void,
    bump_version: () => void,
}

/// The sidebar of the editor when an IO block is selected. Its endpoints are edited in the bar under the diagram.
let IoBlockSidebar = (props: IoBlockSidebarProps) =>{

    const block = props.block;
    const shared = {block, emulator: props.emulator, bump_version: props.bump_version};

    return(
        <SidebarColumn
            style={{padding: "10px 0"}}
            panels={[
                {title: "Emulator List", content: <EmulatorList on_select={props.on_select_emulator}/>},
                {title: block.direction === "source" ? "Source Endpoint Problems" : "Sink Endpoint Problems", content: <IoBlockFields {...shared}/>}
            ]}
        />
    );
};

export default IoBlockSidebar;
