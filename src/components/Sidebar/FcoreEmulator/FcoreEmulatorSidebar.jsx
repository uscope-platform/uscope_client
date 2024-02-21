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

import {useDispatch, useSelector} from "react-redux";

import {up_emulator} from "../../../client_core";
import SidebarBase from "../SidebarBase";
import EmulatorNodeProperties from "./NodesSidebar/EmulatorNodeProperties";
import EmulatorEdgeProperties from "./EdgesSidebar/EmulatorEdgeProperties";
import EmulatorProperties from "./EmulatorProperties";
import {setSetting} from "../../../redux/Actions/SettingsActions";
import WarningsPanel from "./WarningsPanel";
import HilControl from "./HilControl";

let  FcoreEmulatorSidebar = props =>{

    const emulators_store = useSelector(state => state.emulators);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    const selected_emulator = settings.selected_emulator ? new up_emulator(emulators_store[parseInt(settings.selected_emulator)]): null;

    const sel_component_type = settings.emulator_selected_component ? settings.emulator_selected_component.type : null;

    let handle_select_emulator = (sel) =>{
        dispatch(setSetting(["emulator_selected_iom", null]));
        dispatch(setSetting(["emulator_selected_component", null]));
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
            <EmulatorNodeProperties enabled={sel_component_type==="node"} selected_emulator={selected_emulator}/>
            <EmulatorEdgeProperties enabled={sel_component_type==="edge"} selected_emulator={selected_emulator}/>
            <EmulatorProperties enabled={ sel_component_type !== "node"  && sel_component_type !== "edge"} selected_emulator={selected_emulator}/>
            <WarningsPanel/>
            <HilControl enabled={settings.emulator_selected_tab===2} selected_emulator={selected_emulator}/>
        </>

    );

};

export default FcoreEmulatorSidebar;
