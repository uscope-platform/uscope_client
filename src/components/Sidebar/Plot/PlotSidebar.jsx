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
import {Responsive, WidthProvider} from "react-grid-layout";
import TriggerControls from "./TriggerControls";
import {plotPause, plotPlay} from "../../../redux/Actions/plotActions";
import {useDispatch, useSelector, useStore} from "react-redux";

let  PlotSidebar = props =>{

    const store = useStore();

    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();

    let handle_play = ()=>{
        dispatch(plotPlay());
    }
    let handle_pause = ()=>{
        dispatch(plotPause());
    }

    const handle_download = useCallback(()=>{
        let channels = store.getState().plot;
        let data = channels.data.map((ch)=>{
            return ch.y;
        });
        let csv_content = "";
        if(settings.sampling_period){
            csv_content = `time,${channels.data[0].name},${channels.data[1].name},${channels.data[2].name},${channels.data[3].name},${channels.data[4].name},${channels.data[5].name}\n`
            for(let i = 0; i<data[0].length; i++){

                csv_content += `${channels.data[0].x[i]/settings.sampling_period},${data[0][i]},${data[1][i]},${data[2][i]},${data[3][i]},${data[4][i]},${data[5][i]}\n`
            }
        } else {
            csv_content = `${channels.data[0].name},${channels.data[1].name},${channels.data[2].name},${channels.data[3].name},${channels.data[4].name},${channels.data[5].name}\n`
            for(let i = 0; i<data[0].length; i++){

                csv_content += `${data[0][i]},${data[1][i]},${data[2][i]},${data[3][i]},${data[4][i]},${data[5][i]}\n`
            }
        }


        let [month, day, year]    = new Date().toLocaleDateString("en-US").split("/");
        let [hour, minute, second] = new Date().toLocaleTimeString("en-US").split(/:| /);
        let filename = settings.default_ch_group.group_name.replace(' ', '_')+ '_'+ day+month+year+hour+minute+second;

        const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv_content);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        link.setAttribute("id", "csv_download_link");
        document.body.appendChild(link);

        link.click();
        link.remove();
    }, [])

    const ResponsiveGridLayout = WidthProvider(Responsive);

    return (
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="scope_props" data-grid={{x: 0, y: 0, w: 24, h: 2, static: true}} level="level_2">
                <SimpleContent name="Scope Properties" content={
                    <EnablesProperties/>
                }/>
            </UIPanel>
            <UIPanel key="trigger" data-grid={{x: 2, y: 2, w: 24, h: 2.2, static: true}} level="level_2">
                <SimpleContent name="Trigger and Acquisition" content={
                    <TriggerControls  onPlay={handle_play} onPause={handle_pause} onDownload={handle_download}/>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );
};


export default PlotSidebar;
