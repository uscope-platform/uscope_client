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


import {set_channel_status, up_emulator,download_text} from "#client_core";
import {SidebarBase} from "#UI";
import HilControl from "../HilControl.jsx";
import {useAppSelector} from "#redux/hooks.js";

let  HilControlSidebar = props =>{

    const emulators_store = useAppSelector(state => state.emulators);

    let handle_select_emulator = (sel) =>{
        props.on_select(sel);
        props.on_selection({...props.selections, iom:null})
    }

    let on_start = async () =>{
        set_channel_status({0:true, 1:true, 2:true, 3:true, 4:true, 5:true});
        await props.emulator.start_hil();
        props.on_plot_status_update(true);
    };

    let on_stop = async () =>{
        await props.emulator.stop_hil();
        props.on_plot_status_update(false);
    }

    let on_pause = () => {
        props.on_plot_status_update(!props.hil_plot_running);
    }

    let download_sim_data = async () =>{
        let data = await props.emulator.download_hardware_sim_data();
        download_text(data.control, "control_bus.txt");
        download_text(data.code, "code_bus.txt");
        download_text(data.inputs, "input_bus.txt");
    }


    return(
        <div style={{
                display:"flex",
                flexDirection:"column",
                gap:"0.5em"
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
            <HilControl
                onDownloadHilData={props.onDownloadHilData}
                onDownlodHilSim={download_sim_data}
                onStart={on_start}
                onStop={on_stop}
                onPause={on_pause}
            />
        </div>

    );

};

export default HilControlSidebar;
