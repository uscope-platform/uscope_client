// Copyright 2021 University of Nottingham Ningbo China
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

import React, {useReducer} from 'react';


import ScopeProperties from "./ScopeProperties.js";
import {Button, SidebarColumn} from "#UI/index.js";
import {clear_axi_trace, download_axi_trace, is_axi_tracing} from "#client_core/utilities/axi_trace.js";
import TriggerControls from "./TriggerControls.js";
import type {channel_group, ScopeStatus} from "#interfaces/index.js";

interface PlotSidebarProps {
    acquisition_status: ScopeStatus
    on_plot_status_change: (status: boolean) => void;
    on_group_change: (group: channel_group) => void;
    on_download: (req: number) => void;
}

let  PlotSidebar = (props:PlotSidebarProps) =>{

    const [download_req, bump_download_req] = useReducer(x => x + 1, 0);

    let handle_play = ()=>{
        props.on_plot_status_change(true);
    }
    let handle_pause = ()=>{
        props.on_plot_status_change(false);
    }


    return (
        <SidebarColumn panels={[
            {title: "Scope Properties", content: (
                <ScopeProperties
                    on_group_change={props.on_group_change}
                />
            )},
            {title: "Trigger and Acquisition", content: (
                <TriggerControls
                    showAcquisitionStatus
                    onPlay={handle_play}
                    onPause={handle_pause}
                    onDownload={()=>{
                        props.on_download(download_req);
                        bump_download_req();
                    }}
                    acquisition_status={props.acquisition_status}
                />
            )},
            ...(is_axi_tracing() ? [{title: "AXI Trace", content: (
                <div style={{display: "flex", gap: "0.5em", justifyContent: "center", padding: "0.5em"}}>
                    <Button onClick={download_axi_trace}>Download CSV</Button>
                    <Button onClick={clear_axi_trace}>Clear</Button>
                </div>
            )}] : [])
        ]}/>
    );
};


export default PlotSidebar;
