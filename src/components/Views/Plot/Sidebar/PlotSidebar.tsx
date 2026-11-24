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

import React, {useReducer, useState} from 'react';
import {styled} from "goober";


import ScopeProperties from "./ScopeProperties.js";
import {Button, SidebarColumn, useDeveloperMode} from "#UI/index.js";
import {clear_axi_trace, download_axi_trace, is_axi_tracing} from "#client_core/utilities/axi_trace.js";
import TriggerControls from "./TriggerControls.js";
import type {raw_capture_mode} from "#client_core/index.js";
import type {channel_group, ScopeStatus} from "#interfaces/index.js";

// the buttons share the width of the sidebar instead of being squeezed side by side
const ButtonColumn = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.8rem 1rem 1rem;

  & > button {
    width: 100%;
    font-size: 0.9rem;
    padding: 0.5em 0.8em;
  }
`

interface PlotSidebarProps {
    acquisition_status: ScopeStatus
    on_plot_status_change: (status: boolean) => void;
    on_group_change: (group: channel_group) => void;
    on_download: (req: number) => void;
    on_raw_capture: (mode: raw_capture_mode) => Promise<void>;
}

let  PlotSidebar = (props:PlotSidebarProps) =>{

    const developer_mode = useDeveloperMode();
    const [capturing, set_capturing] = useState(false);

    const capture = async (mode: raw_capture_mode) => {
        set_capturing(true);
        try {
            await props.on_raw_capture(mode);
        } finally {
            set_capturing(false);
        }
    };
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
            ...(developer_mode ? [{title: "Raw Buffer Dump", content: (
                <ButtonColumn>
                    <Button disabled={capturing} onClick={() => capture("raw")}>Download raw words</Button>
                    <Button disabled={capturing} onClick={() => capture("columns")}>Download by channel</Button>
                </ButtonColumn>
            )}] : []),
            ...(is_axi_tracing() ? [{title: "AXI Trace", content: (
                <ButtonColumn>
                    <Button onClick={download_axi_trace}>Download CSV</Button>
                    <Button onClick={clear_axi_trace}>Clear</Button>
                </ButtonColumn>
            )}] : [])
        ]}/>
    );
};


export default PlotSidebar;
