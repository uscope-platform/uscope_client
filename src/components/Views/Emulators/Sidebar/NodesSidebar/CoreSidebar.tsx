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
import EmulatorCoreProperties from "./EmulatorCoreProperties.jsx";
import EmulatorCoreDeploymentProperties from "./EmulatorCoreDeploymentProperties.jsx";
import NodeIomProperties from "./EndpointProperties/NodeIomProperties.jsx";
import type {core, EmulatorComponentSelector, EmulatorIomSelector} from "#interfaces/index.js";

const IOM_TITLES = {inputs: "Input Properties", outputs: "Output Properties", memory_init: "Memory Properties"} as const;

interface CoreSidebarProps {
    emulator: up_emulator,
    selected_core: core,
    selected_component: EmulatorComponentSelector,
    /// the input, output or memory of the core that is being edited
    selected_iom: EmulatorIomSelector | null,
    on_iom_modify: (iom: EmulatorIomSelector) => void,
    on_select_emulator: (emulator: number) => void,
    bump_version: () => void,
}

/// The sidebar of the editor when a core is selected
let CoreSidebar = (props: CoreSidebarProps) =>{
    const iom = props.selected_iom;

    return(
        <SidebarColumn
            style={{padding: "10px 0"}}
            panels={[
                {title: "Emulator List", content: <EmulatorList on_select={props.on_select_emulator}/>},
                {title: "Node Properties", content: (
                    <EmulatorCoreProperties
                        selected_core={props.selected_core}
                        selected_emulator={props.emulator}
                        selected_component={props.selected_component}
                        bump_version={props.bump_version}
                    />
                )},
                ...(props.emulator.deployment_mode ? [{title: "Deployment Properties", content: (
                    <EmulatorCoreDeploymentProperties
                        selected_core={props.selected_core}
                        deployment={props.selected_core.deployment}
                        emulator={props.emulator}
                    />
                )}] : []),
                ...(iom ? [{title: IOM_TITLES[iom.type], min_height: "200px", content: (
                    <NodeIomProperties
                        selected_core={props.selected_core}
                        selected_iom={iom}
                        selected_emulator={props.emulator}
                        selected_component={props.selected_component}
                        on_iom_modify={props.on_iom_modify}
                    />
                )}] : [])
            ]}
        />
    );
};

export default CoreSidebar;
