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
import {ColorTheme, PlotConfigurations, SelectableList, SimpleContent, UIPanel} from "../../UI_elements";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";


const Plot = createPlotlyComponent(Plotly);

let EmulationResults = function (props) {

    let [selected_source, set_selected_source] = useState();
    let [selected_output, set_selected_output] = useState([]);
    let [selected_channel, set_selected_channel] = useState([]);

    let [data, set_data] = useState([
    ])

    const [data_revision,update_data ] = useReducer(x => x + 1, 0);

    let plot_layout = {...PlotConfigurations.layout,colorway:ColorTheme.plot_palette};
    plot_layout.width = 800;
    plot_layout.height = 560;

    let plot_config = {...PlotConfigurations.configs, response:true};

    let handle_select_channel = (channel,multi_selection)=>{
        if(multi_selection){
            props.results.add_data_series(selected_source, selected_output, channel, 0);
        } else {
            props.results.set_data_series(selected_source, selected_output, channel, 0);
        }

        let [timebase, data] = props.results.get_data_series();

        set_data(data.map((item)=>{
            return({
                name:item.name,
                x: timebase,
                y: item.content,
                type: 'scatter',
                mode: 'lines'
            })
        }));
        set_selected_channel(channel);
        update_data();
    }

    return(
        <div style={{
            display:"flex",
            flexDirection:"column",
            gap:10,
            height:"100%",
            margin:10
        }}>
            <UIPanel key="emulation_result_plots" level="level_2">
                <SimpleContent name="Results Plot" height="100%" content={
                    <Plot
                        data={data}
                        layout={plot_layout}
                        config={plot_config}
                        revision={data_revision}
                    />
                }/>
            </UIPanel>
            <div style={{
                display:"flex",
                flexDirection:"row",
                minHeight:"300px",
                gap:10
            }}>
                <UIPanel style={{flexGrow:1}} key="emulation_result_core_sel" level="level_2">
                    <SimpleContent name="Core Selector" height="100%" content={
                        <div>
                            <SelectableList items={props.results.get_data_sources()} selected_item={selected_source} onSelect={set_selected_source} />
                        </div>
                    }/>
                </UIPanel>
                <UIPanel style={{flexGrow:1}} key="emulation_result_data_sel" level="level_2">
                    <SimpleContent name="Data Selector" height="100%" content={
                        <div>
                            <SelectableList multi_select items={props.results.get_available_data_series(selected_source)} selected_item={selected_output} onSelect={set_selected_output} />
                        </div>
                    }/>
                </UIPanel>
                <UIPanel style={{flexGrow:1}} key="emulation_channel_select" level="level_2">
                    <SimpleContent name="Channel Selector" height="100%" content={
                        <div>
                            <SelectableList multi_select items={props.results.get_series_channels(selected_source, selected_output)} selected_item={selected_channel} onSelect={handle_select_channel} />
                        </div>
                    }/>
                </UIPanel>
            </div>
        </div>


);
};


export default EmulationResults;
