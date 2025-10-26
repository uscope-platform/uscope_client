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

import React, {useState} from 'react';
import HilPlotTab from "./HilPlotTab.jsx";
import HilControlSidebar from "../Sidebar/per_panel_sidebars/HilControlSidebar.jsx";
import {up_emulator} from "#client_core/index.js";
import type {EmulatorSelections} from "#interfaces/index.js";

interface HilControlViewProps {
    emulator: up_emulator,
    selections: EmulatorSelections,
    on_select: (sel: number) => void,
    set_selections: (selection: EmulatorSelections) => void,
    deployed: boolean
}

let HilControlView = function (props: HilControlViewProps) {

    let [hil_plot_running, set_hil_plot_running] = useState(false);
    let [download_data_request, set_download_data_request] = useState(false);

    return(
        <div style={{
            display:"flex",
            flexDirection:"row",
            gap:10,
            height:"100%"
        }}>

            <HilPlotTab
                emulator={props.emulator}
                deployed={props.deployed}
                hil_plot_running={hil_plot_running}
                download_data_request={download_data_request}
                on_download_done={set_download_data_request}
            />
            <HilControlSidebar
                emulator={props.emulator}
                selections={props.selections}
                set_selections={props.set_selections}
                on_select={props.on_select}
                hil_plot_running={hil_plot_running}
                on_plot_status_update={set_hil_plot_running}
                onDownloadHilData={set_download_data_request}
            />
        </div>

    );
};


export default HilControlView;
