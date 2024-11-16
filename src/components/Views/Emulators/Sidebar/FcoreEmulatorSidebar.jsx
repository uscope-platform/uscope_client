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

import {useSelector} from "react-redux";

import {set_channel_status, up_emulator} from "../../../../client_core";
import SidebarBase from "../../../UI_elements/Sidebar/SidebarBase";
import EmulatorNodeProperties from "./NodesSidebar/EmulatorNodeProperties";
import EmulatorEdgeProperties from "./EdgesSidebar/EmulatorEdgeProperties";
import EmulatorProperties from "./EmulatorProperties";
import WarningsPanel from "./WarningsPanel";
import HilControl from "./HilControl";
import AsmSelector from "./AsmSelector.jsx";

let  FcoreEmulatorSidebar = props =>{

    const emulators_store = useSelector(state => state.emulators);


    const sel_component_type = props.selected_component ? props.selected_component.type : null;

    let handle_select_emulator = (sel) =>{
        props.on_select(sel);
        props.on_iom_modify(null);
    }
    let on_start = () =>{
        set_channel_status({0:true, 1:true, 2:true, 3:true, 4:true, 5:true}).then();
        props.emulator.start_hil().then(()=>{
            props.on_plot_status_update(true);
        });
    };

    let on_stop = () =>{
        props.emulator.stop_hil().then(()=>{
            props.on_plot_status_update(false);
        });
    }

    let on_pause = () => {
        props.on_plot_status_update(!props.hil_plot_running);
    }

    return(
        <>
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
                selected_emulator={props.emulator}
                on_iom_modify={props.on_iom_modify}
                selected_component={props.selected_component}
                selected_iom={props.selected_iom}
            />
            <EmulatorEdgeProperties
                enabled={sel_component_type==="edge"}
                selected_emulator={props.emulator}
                selected_component={props.selected_component}
            />
            <EmulatorProperties
                enabled={ props.selected_tab===0 && sel_component_type !== "node"  && sel_component_type !== "edge"}
                selected_emulator={props.emulator}
            />
            <WarningsPanel
                compile_warning={props.compile_warning}
                enabled={props.selected_component === null}
            />
            <HilControl
                onDownloadHilData={props.onDownloadHilData}
                enabled={props.selected_tab === 2}
                onStart={on_start}
                onStop={on_stop}
                onPause={on_pause}
            />
            <AsmSelector
                enable={props.selected_tab === 3}
                programs={props.compiled_programs}
                selected_program={props.selected_program}
                on_select={props.on_program_select}
            />
        </>

    );

};

export default FcoreEmulatorSidebar;
