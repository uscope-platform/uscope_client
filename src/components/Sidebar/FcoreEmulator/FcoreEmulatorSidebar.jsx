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

import {set_channel_status, up_emulator} from "../../../client_core";
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

    const sel_component_type = settings.emulator_selected_component ? settings.emulator_selected_component.type : null;

    let handle_select_emulator = (sel) =>{
        props.on_select(sel);
        dispatch(setSetting(["emulator_selected_iom", null]));
        dispatch(setSetting(["emulator_selected_component", null]));
    }
    let on_start = () =>{
        set_channel_status({0:true, 1:true, 2:true, 3:true, 4:true, 5:true});
        props.emulator.start_hil().then(()=>{
            dispatch(setSetting(["hil_plot_running", true]));
        });
    };

    let on_stop = () =>{
        props.emulator.stop_hil().then(()=>{
            dispatch(setSetting(["hil_plot_running", false]));
        });
    }

    let on_pause = () => {
        let new_status= !settings.hil_plot_running;
        dispatch(setSetting(["hil_plot_running", new_status]));
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
            <EmulatorNodeProperties enabled={sel_component_type==="node"} selected_emulator={props.emulator}/>
            <EmulatorEdgeProperties enabled={sel_component_type==="edge"} selected_emulator={props.emulator}/>
            <EmulatorProperties enabled={ sel_component_type !== "node"  && sel_component_type !== "edge"} selected_emulator={props.emulator}/>
            <WarningsPanel/>
            <HilControl enabled={settings.emulator_selected_tab===2} onStart={on_start} onStop={on_stop} onPause={on_pause}/>

        </>

    );

};

export default FcoreEmulatorSidebar;
