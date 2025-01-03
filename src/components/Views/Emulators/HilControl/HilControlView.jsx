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
import HilPlotTab from "./HilPlotTab.jsx";
import HilControlSidebar from "../Sidebar/per_panel_sidebars/HilControlSidebar.jsx";

let HilControlView = function (props) {

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
                hil_plot_running={props.hil_plot_running}
                download_data_request={props.download_data_request}
                on_download_done={props.set_download_data_request}
            />
            <HilControlSidebar
                emulator={props.emulator}
                selections={props.selections}
                on_selection={props.set_selections}
                on_select={props.on_select}
                hil_plot_running={props.hil_plot_running}
                on_plot_status_update={props.set_hil_plot_running}
                onDownloadHilData={props.set_download_data_request}
            />
        </div>

    );
};


export default HilControlView;
