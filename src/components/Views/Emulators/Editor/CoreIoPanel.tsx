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

// the hint that stands where there is nothing to show yet
const placeholder_style: React.CSSProperties = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1em",
    textAlign: "center",
    fontStyle: "italic",
    color: "var(--text-secondary)",
};

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
        : <div style={placeholder_style}>Select an item to edit it</div>;

    const with_properties = (list: React.ReactNode) => (
        <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
            <div style={{flex: "0 0 14em", overflowY: "auto", overflowX: "hidden", background: ColorTheme.background.level_3}}>{list}</div>
            <div style={{flex: 1, minWidth: 0, overflow: "auto"}}>{properties}</div>
        </div>
    );

    // without a core there is nothing to add to: the tab is dimmed and does not take clicks
    const needs_core = (content: React.ReactNode) => core !== undefined ? content : (
        <div style={{position: "relative", height: "100%"}}>
            <div aria-disabled="true" inert style={{height: "100%", opacity: 0.4, pointerEvents: "none", filter: "grayscale(1)", userSelect: "none"}}>
                {content}
            </div>
            <div style={{...placeholder_style, position: "absolute", inset: 0, height: "auto", pointerEvents: "none"}}>
                Select a core to edit its inputs, outputs and memory
            </div>
        </div>
    );

    return(
        <TabbedContent names={TABS} onSelect={props.on_tab_select} selected={props.selected_tab}>
            {needs_core(with_properties(<CoreInputsList {...list_props}/>))}
            {needs_core(with_properties(<CoreOutputsList {...list_props}/>))}
            {needs_core(with_properties(<CoreMemoriesList {...list_props}/>))}
            {needs_core(<CoreInputFilesList emulator={props.emulator} selections={props.selections}/>)}
        </TabbedContent>
    );
};

export default CoreIoPanel;
