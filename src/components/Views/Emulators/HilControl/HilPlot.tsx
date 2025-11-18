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

import React, {useEffect, useReducer, useState} from 'react';
//@ts-ignore
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";
import {download_plot, direct_fetch} from "#client_core/index.js";
import useInterval from "../../../Common_Components/useInterval.js";
import {ColorTheme, PlotConfigurations} from "#UI/index.js";
import type {plot_channel} from "#interfaces/index.js";


const Plot = createPlotlyComponent(Plotly);

interface HilPlotProps {
    download_data_request: boolean,
    on_download_done: (done: boolean) => void
    hil_plot_running: boolean,
    refreshPeriod: number,
    sampling_frequency: number,
    selected_outputs: string[]
}

let HilPlot = function (props: HilPlotProps) {

    let [data, set_data] = useState<plot_channel[]>([])

    const [data_revision,update_data ] = useReducer(x => x + 1, 0);
    // TODO: implement adaptive plot palette?
    let plot_layout = {...PlotConfigurations.layout,colorway:ColorTheme.plot_palette};
    plot_layout.width = 1100 as any;
    plot_layout.height = 550 as any;

    let plot_config = {...PlotConfigurations.configs, response:true};


    useEffect(() => {
        if(props.download_data_request){
            download_plot(data, "hil_data");
            props.on_download_done(false);
        }
    }, [props.download_data_request]);

    let  handleRefresh = async () =>{
        if(props.hil_plot_running){
            try{
                let data = await direct_fetch();
                if(data.length === 0 || data[0] === undefined) return;
                let x = [...Array(data[0].data.length).keys()].map(x=> x/props.sampling_frequency);

                let selected_data = data.map((channel): plot_channel=>{
                    let n =props.selected_outputs[channel.channel];
                    return {
                        name: n !== undefined? n:   "",
                        x: x,
                        y: channel.data,
                        type: 'scatter',
                        mode: 'lines',
                        visible: true
                    };
                })
                set_data(selected_data);
            } catch(err){
                console.error(err);
            }
        }
    };

    useInterval(() => {
        handleRefresh();
    },  props.refreshPeriod);


    return(
        <div>
            <Plot
                data={data}
                layout={plot_layout}
                config={plot_config}
                revision={data_revision}
            />
        </div>
    );
};


export default HilPlot;
