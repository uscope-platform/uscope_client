// Copyright 2025 Filippo Savi
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

import {up_emulator} from "#client_core/index.js";
import EmulatorSidebar from "../EmulatorSidebar.jsx";
import CoreSidebar from "../NodesSidebar/CoreSidebar.jsx";
import IoBlockSidebar from "../NodesSidebar/IoBlockSidebar.jsx";
import EdgeSidebar from "../EdgesSidebar/EdgeSidebar.jsx";
import type {EmulatorSelections} from "#interfaces/index.js";

interface HilEditorSidebarProps {
    emulator: up_emulator,
    selections: EmulatorSelections,
    bump_version: () => void,
    compile_warning: string[],
    on_emulator_select: (emulator: number) => void,
    set_selections:(selection: EmulatorSelections) => void,
}

/// The sidebar of the editor: the one of what is selected, the emulator, a core, an IO block or an edge
let  HilEditorSidebar = (props: HilEditorSidebarProps) =>{

    let handle_select_emulator = (sel: number) =>{
        props.on_emulator_select(sel);
        props.set_selections({...props.selections, iom:null})
    }

    const component = props.selections.component;

    if(component === null){
        return <EmulatorSidebar
            emulator={props.emulator}
            compile_warning={props.compile_warning}
            on_select_emulator={handle_select_emulator}
        />;
    }

    if(component.type === "edge"){
        return <EdgeSidebar
            key={component.obj.from + "-" + component.obj.to}
            emulator={props.emulator}
            edge={component.obj}
            on_select_emulator={handle_select_emulator}
        />;
    }

    const io_block = props.emulator.io_blocks[component.obj.id];
    if(io_block){
        return <IoBlockSidebar
            key={io_block.id}
            emulator={props.emulator}
            block={io_block}
            on_select_emulator={handle_select_emulator}
            bump_version={props.bump_version}
        />;
    }

    const selected_core = Object.values(props.emulator.cores).find((c) => c.id === component.obj.id);
    if(selected_core === undefined) return null;

    return <CoreSidebar
        emulator={props.emulator}
        selected_core={selected_core}
        selected_component={component}
        on_select_emulator={handle_select_emulator}
        bump_version={props.bump_version}
    />;
};

export default HilEditorSidebar;
