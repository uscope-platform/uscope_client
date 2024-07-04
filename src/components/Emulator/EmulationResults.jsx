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
import {ColorTheme, PlotConfigurations, SelectableList, SimpleContent, UIPanel} from "../UI_elements";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";


const Plot = createPlotlyComponent(Plotly);

let EmulationResults = function (props) {

    let [selected_core, set_selected_core] = useState();
    let [timebase, set_timebase] = useState();
    let [selected_output, set_selected_output] = useState([]);

    let [cores, set_cores] = useState([]);
    let [outputs, set_outputs] = useState([]);

    let [data, set_data] = useState([
    ])

    const [data_revision,update_data ] = useReducer(x => x + 1, 0);

    useEffect(() => {
        let cores = [...Object.keys(props.results)];
        cores = cores.filter(item => {return item !== "timebase"});
        if(props.inputs){
            cores = [...cores, ...Object.keys(props.inputs)];
        }
        set_timebase(props.results['timebase']);
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


    let plot_layout = {...PlotConfigurations.layout,colorway:ColorTheme.plot_palette};
    plot_layout.width = 800;
    plot_layout.height = 560;

    let plot_config = {...PlotConfigurations.configs, response:true};

    let handle_datapoint_select = (datapoint, multi_selection) =>{

        if(selected_output.includes(datapoint)) return;
        let selected_data = [];
        if(props.results.hasOwnProperty(selected_core)){
            selected_data = props.results[selected_core].outputs[datapoint];
        } else {
            selected_data = props.inputs[selected_core][datapoint];
        }
        if(selected_data[0].length === undefined){
            selected_data = [{
                name:datapoint,
                x: timebase,
                y: selected_data,
                type: 'scatter',
                mode: 'lines'
            }];
        } else {

            selected_data = selected_data.map((trace)=>{
                return {
                    name:datapoint,
                    x: timebase,
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
                            <SelectableList items={cores} selected_item={selected_core} onSelect={set_selected_core} />
                        </div>
                    }/>
                </UIPanel>
                <UIPanel style={{flexGrow:1}} key="emulation_result_data_sel" level="level_2">
                    <SimpleContent name="Data Selector" height="100%" content={
                        <div>
                            <SelectableList multi_select items={outputs} selected_item={selected_output} onSelect={handle_datapoint_select} />
                        </div>
                    }/>
                </UIPanel>
            </div>
        </div>


);
};


export default EmulationResults;
