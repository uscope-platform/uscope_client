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

import React, {useCallback} from 'react';


import EnablesProperties from "./EnablesProperties";
import {SimpleContent, UIPanel} from "../../UI_elements";
import TriggerControls from "./TriggerControls";
import {plotPause, plotPlay} from "../../../redux/Actions/plotActions";
import {useDispatch, useSelector, useStore} from "react-redux";
import {download_plot} from "../../../client_core";

let  PlotSidebar = props =>{

    const store = useStore();

    const dispatch = useDispatch();

    let handle_play = ()=>{
        dispatch(plotPlay());
    }
    let handle_pause = ()=>{
        dispatch(plotPause());
    }

    const handle_download = useCallback(()=>{
        let state = store.getState();
        download_plot(state.plot.data, state.settings.sampling_period, state.settings.default_ch_group.group_name);
    }, [])


    return (
        <div style={{
            display:"flex",
            flexDirection:"column",
            gap:10
        }}>
            <UIPanel key="scope_props" data-grid={{x: 0, y: 0, w: 24, h: 2, static: true}} level="level_2">
                <SimpleContent name="Scope Properties" content={
                    <EnablesProperties/>
                }/>
            </UIPanel>
            <UIPanel key="trigger" data-grid={{x: 2, y: 2, w: 24, h: 2.2, static: true}} level="level_2">
                <SimpleContent name="Trigger and Acquisition" content={
                    <TriggerControls showAcquisitionStatus onPlay={handle_play} onPause={handle_pause} onDownload={handle_download}/>
                }/>
            </UIPanel>
        </div>
    );
};


export default PlotSidebar;
