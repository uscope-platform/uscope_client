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


import {up_emulator} from "#client_core";
import {SidebarBase} from "@UI";
import EmulatorNodeProperties from "../NodesSidebar/EmulatorNodeProperties";
import EmulatorEdgeProperties from "../EdgesSidebar/EmulatorEdgeProperties";
import EmulatorProperties from "../EmulatorProperties";
import WarningsPanel from "../WarningsPanel";
import {useAppSelector} from "#redux/hooks.js";

let  HilEditorSidebar = props =>{

    const emulators_store = useAppSelector(state => state.emulators);


    const sel_component_type = props.selections.component ? props.selections.component.type : null;

    let handle_select_emulator = (sel) =>{
        props.on_select(sel);
        props.on_selection({...props.selections, iom:null})
    }

    const handle_node_iom_modify = (iom) =>{
        let new_selection = {...props.selections, iom:iom};
        props.on_selection(new_selection)
    }

    return(
        <div
        style={{
            display:"flex",
            flexDirection:"column",
            gap:"0.5em",
            minWidth:"25em",
            paddingTop:"10px",
            paddingBottom:"10px",
            paddingRight:"10px"
        }}>
            <SidebarBase
                objects={emulators_store}
                selection_key="id"
                template={up_emulator}
                display_key="name"
                content_name="Emulator"
                selector="selected_emulator"
                height={2}
                onSelect={handle_select_emulator}
            />
            <EmulatorNodeProperties
                enabled={sel_component_type==="node"}
                bump_version={props.bump_version}
                selected_emulator={props.emulator}
                on_iom_modify={handle_node_iom_modify}
                selected_component={props.selections.component}
                selected_iom={props.selections.iom}
            />
            <EmulatorEdgeProperties
                enabled={sel_component_type==="edge"}
                selected_emulator={props.emulator}
                selected_component={props.selections.component}
            />
            <EmulatorProperties
                enabled={sel_component_type !== "node"  && sel_component_type !== "edge"}
                selected_emulator={props.emulator}
            />
            <WarningsPanel
                compile_warning={props.compile_warning}
                enabled={props.selections.component === null}
            />
        </div>

    );

};

export default HilEditorSidebar;
