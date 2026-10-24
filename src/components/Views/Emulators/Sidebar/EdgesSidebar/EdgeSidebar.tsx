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
import type {EmulatorGraphEdge} from "#interfaces/index.js";

interface EdgeSidebarProps {
    emulator: up_emulator,
    edge: EmulatorGraphEdge,
    on_select_emulator: (emulator: number) => void,
}

/// The sidebar of the editor when an edge is selected. The DMA channels of the edge are in the bar under the diagram.
let EdgeSidebar = (props: EdgeSidebarProps) =>{
    return(
        <SidebarColumn
            style={{padding: "10px 0"}}
            panels={[
                {title: "Emulator List", content: <EmulatorList on_select={props.on_select_emulator}/>},
            ]}
        />
    );
};

export default EdgeSidebar;
