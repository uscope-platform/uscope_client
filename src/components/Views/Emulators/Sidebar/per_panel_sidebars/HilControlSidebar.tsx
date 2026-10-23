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


import {up_emulator,download_text} from "#client_core/index.js";
import {ColorTheme, SidebarColumn} from "#UI/index.js";
import EmulatorList from "../EmulatorList.jsx";
import TriggerControls from "../../../Plot/Sidebar/TriggerControls.js";
import {MdSimCardDownload} from "react-icons/md";
import type {EmulatorSelections} from "#interfaces/index.js";

interface HilControlSidebarProps {
    emulator: up_emulator,
    selections: EmulatorSelections,
    on_plot_status_update: (status: boolean) => void,
    hil_plot_running: boolean,
    onDownloadHilData: (req: boolean) => void,
    on_select: (sel: number) => void,
    set_selections: (selection: EmulatorSelections) => void
    set_prescaler: (prescaler: number) => void
}

let  HilControlSidebar = (props:HilControlSidebarProps) =>{


    let handle_select_emulator = (sel: number) =>{
        props.on_select(sel);
        props.set_selections({...props.selections, iom:null})
    }

    let on_start = async () =>{
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
        if(data === undefined) return;
        download_text(data.control, "control_bus.txt");
        download_text(data.code, "code_bus.txt");
        download_text(data.inputs, "input_bus.txt");
    }


    return(
        <SidebarColumn panels={[
            {title: "Emulator List", content: (
                <EmulatorList on_select={handle_select_emulator}/>
            )},
            {title: "Trigger and Acquisition", content: (
                <TriggerControls
                    acquisition_status={"unknown"}
                    showAcquisitionStatus={false}
                    onPlay={on_start}
                    onPause={on_pause}
                    onStop={on_stop}
                    set_prescaler={props.set_prescaler}
                    onDownload={() => props.onDownloadHilData(true)}
                />
            )},
            {title: "Controls", content: (
                <MdSimCardDownload id='play' size={ColorTheme.icons_size} color={ColorTheme.icons_color} onClick={download_sim_data}/>
            )}
        ]}/>
    );

};

export default HilControlSidebar;
