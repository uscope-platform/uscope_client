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

import {ColorTheme, TabbedContent} from "#UI/index.js";
import {up_emulator} from "#client_core/index.js";
import CoreInputsList from "./CoreInputsList.js";
import CoreOutputsList from "./CoreOutputsList.js";
import CoreMemoriesList from "./CoreMemoriesList.js";
import CoreInputFilesList from "./CoreInputFilesList.js";
import NodeIomProperties from "../Sidebar/NodesSidebar/EndpointProperties/NodeIomProperties.js";
import type {EmulatorIomSelector, EmulatorSelections} from "#interfaces/index.js";

const TABS = ["Inputs", "Outputs", "Memory", "Input Files"];
const TAB_TYPES: (EmulatorIomSelector["type"] | null)[] = ["inputs", "outputs", "memory_init", null];

interface CoreIoPanelProps {
    emulator: up_emulator,
    selections: EmulatorSelections,
    on_selection: (iom: EmulatorIomSelector) => void,
    selected_tab: number,
    on_tab_select: (tab: number) => void,
}

/// The inputs, outputs and memory of the selected core, each tab with its list and the properties of the selected item beside it
let CoreIoPanel = (props: CoreIoPanelProps) =>{

    const component = props.selections.component;
    const core = component?.type === "node"
        ? Object.values(props.emulator.cores).find((c) => c.id === component.obj.id)
        : undefined;

    const iom = props.selections.iom;
    const show_properties = core !== undefined && component !== null && iom !== null && iom.type === TAB_TYPES[props.selected_tab];

    const list_props = {emulator: props.emulator, selections: props.selections, on_selection: props.on_selection};

    const properties = show_properties
        ? <NodeIomProperties
            selected_core={core}
            selected_iom={iom}
            selected_emulator={props.emulator}
            selected_component={component}
            on_iom_modify={props.on_selection}
        />
        : <span style={{color: "var(--text-secondary)"}}>Select an item to edit it</span>;

    const with_properties = (list: React.ReactNode) => (
        <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
            <div style={{flex: "0 0 14em", overflowY: "auto", overflowX: "hidden", background: ColorTheme.background.level_3}}>{list}</div>
            <div style={{flex: 1, minWidth: 0, overflow: "auto"}}>{properties}</div>
        </div>
    );

    return(
        <TabbedContent names={TABS} onSelect={props.on_tab_select} selected={props.selected_tab}>
            {with_properties(<CoreInputsList {...list_props}/>)}
            {with_properties(<CoreOutputsList {...list_props}/>)}
            {with_properties(<CoreMemoriesList {...list_props}/>)}
            <CoreInputFilesList emulator={props.emulator} selections={props.selections}/>
        </TabbedContent>
    );
};

export default CoreIoPanel;
