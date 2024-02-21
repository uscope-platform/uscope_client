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

import React, {useReducer, useState} from 'react';
import {Responsive, WidthProvider} from "react-grid-layout";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";
import {useDispatch, useSelector} from "react-redux";
import PlotControls from "../../plot_tab_components/PlotControls";
import {fetch_data} from "../../../client_core";
import useInterval from "../../Common_Components/useInterval";
import axios from "axios";
import {fetchDataDone} from "../../../redux/Actions/plotActions";
import {api_dictionary} from "../../../client_core/proxy/api_dictionary";
import {direct_fetch} from "../../../client_core/proxy/plot";
import {setSetting} from "../../../redux/Actions/SettingsActions";


const Plot = createPlotlyComponent(Plotly);

const ResponsiveGridLayout = WidthProvider(Responsive);

let HilPlot = function (props) {

    const channels = useSelector(state => state.plot);
    const settings = useSelector(state => state.settings);


    let [data, set_data] = useState([
    ])

    const [data_revision,update_data ] = useReducer(x => x + 1, 0);

    let plot_layout = {...channels.layout,...settings.plot_palette};
    plot_layout.width = 1100;
    plot_layout.height = 550;

    let plot_config = {...channels.config, response:true};

    const [plot_running, set_plot_running] = useState(false)

    let  handleRefresh = () =>{
        if(settings.hil_plot_running){
           direct_fetch().then((data)=>{

               let x = [...Array(data[0].data.length).keys()];

               let selected_data = data.map((channel)=>{
                   return {
                       name:channel.channel,
                       x: x,
                       y: channel.data,
                       type: 'scatter',
                       mode: 'lines'
                   };
               })
               set_data(selected_data);
           }).catch((err)=>{

           })
        }
    };

    useInterval(() => {
        handleRefresh();
    },  settings.refreshRate);

    const dispatch = useDispatch();

    let handle_pause = () => {
        dispatch(setSetting(["hil_plot_running", false]));
    }

    return(
        <div>
            <Plot
                data={data}
                layout={plot_layout}
                config={plot_config}
                revision={data_revision}
            />
            <PlotControls onPause={handle_pause}/>
        </div>
    );
};


export default HilPlot;
