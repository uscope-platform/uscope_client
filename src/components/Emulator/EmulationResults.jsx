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
import {SelectableList, SimpleContent, UIPanel} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";
import {useSelector} from "react-redux";


const Plot = createPlotlyComponent(Plotly);

const ResponsiveGridLayout = WidthProvider(Responsive);

let EmulationResults = function (props) {

    const channels = useSelector(state => state.plot);
    const settings = useSelector(state => state.settings);

    let [selected_core, set_selected_core] = useState();
    let [selected_output, set_selected_output] = useState([]);

    let [cores, set_cores] = useState([]);
    let [outputs, set_outputs] = useState([]);

    let [data, set_data] = useState([
    ])

    const [data_revision,update_data ] = useReducer(x => x + 1, 0);

    useEffect(() => {
        let cores = [...Object.keys(props.results)];
        if(props.inputs){
            cores = [...cores, ...Object.keys(props.inputs)];
        }
        set_cores(cores);
    }, [props.results]);


    useEffect(() => {
        if(props.results && selected_core){
            let outputs = []
            if(props.results.hasOwnProperty(selected_core)){
                outputs = Object.keys(props.results[selected_core].outputs);
            } else {
                outputs = Object.keys(props.inputs[selected_core]);
            }
            set_outputs(outputs);
        }
    }, [selected_core]);


    let plot_layout = {...channels.layout,...settings.plot_palette};
    plot_layout.width = 800;
    plot_layout.height = 560;

    let plot_config = {...channels.config, response:true};

    let handle_datapoint_select = (datapoint, multi_selection) =>{
        let x = [];
        if(selected_output.includes(datapoint)) return;
        let selected_data = [];
        if(props.results.hasOwnProperty(selected_core)){
            selected_data = props.results[selected_core].outputs[datapoint];
        } else {
            selected_data = props.inputs[selected_core][datapoint];
        }
        if(selected_data[0].length === undefined){
            for(let i =0; i<selected_data.length; i++){
                x.push(i);
            }
            selected_data = [{
                name:datapoint,
                x: x,
                y: selected_data,
                type: 'scatter',
                mode: 'lines'
            }];
        } else {
            for(let i =0; i<selected_data[0].length; i++){
                x.push(i);
            }
            selected_data = selected_data.map((trace)=>{
                return {
                    name:datapoint,
                    x: x,
                    y: trace,
                    type: 'scatter',
                    mode: 'lines'
                };
            })
        }
        if(multi_selection){
            set_data([...data, ...selected_data]);
            set_selected_output([...selected_output, datapoint]);
        } else{
            set_selected_output([datapoint]);
            set_data(selected_data);
        }
        update_data();
    }

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            useCSSTransforms={false}
        >
            <UIPanel key="emulation_result_plots" data-grid={{x: 0, y: 0, w: 14, h: 16, static: true}} level="level_2">
                <SimpleContent name="Results Plot" height="100%" content={
                    <Plot
                        data={data}
                        layout={plot_layout}
                        config={plot_config}
                        revision={data_revision}
                    />
                }/>
            </UIPanel>
            <UIPanel key="emulation_result_core_sel" data-grid={{x: 14, y: 0, w: 6, h: 8, static: true}} level="level_2">
                <SimpleContent name="Core Selector" height="100%" content={
                    <div>
                        <SelectableList items={cores} selected_item={selected_core} onSelect={set_selected_core} />
                    </div>
                }/>
            </UIPanel>
            <UIPanel key="emulation_result_data_sel" data-grid={{x: 14, y: 8, w: 6, h: 8, static: true}} level="level_2">
                <SimpleContent name="Data Selector" height="100%" content={
                    <div>
                        <SelectableList multi_select items={outputs} selected_item={selected_output} onSelect={handle_datapoint_select} />
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>


);
};


export default EmulationResults;
