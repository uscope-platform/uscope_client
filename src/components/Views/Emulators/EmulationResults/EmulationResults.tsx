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

import React, { useReducer, useState} from 'react';
import {ColorTheme, PlotConfigurations, SelectableList, SimpleContent, UIPanel} from "#UI/index.js";

//@ts-ignore
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";

import ResultsPlotLegend from "#components/Views/Emulators/EmulationResults/ResultsPlotLegend.jsx";
import {up_emulator_result} from "#client_core/index.js";
import type {EmulatorResultLegendItem} from "#interfaces/index.js";


const Plot = createPlotlyComponent(Plotly);

interface EmulationResultsProps {
    results: up_emulator_result,
}

let EmulationResults = function (props: EmulationResultsProps) {

    let [selected_source, set_selected_source] = useState("");
    let [selected_output, set_selected_output] = useState("");
    let [selected_channel, set_selected_channel] = useState("");
    let [selected_index, set_selected_index] = useState("");


    let [data, set_data] = useState([])
    let [inputs_mode, set_inputs_mode] = useState(false);

    let [plot_legends, set_plot_legends] = useState<EmulatorResultLegendItem[]>([])

    const [data_revision,update_data ] = useReducer(x => x + 1, 0);

    let plot_layout = {...PlotConfigurations.layout,colorway:ColorTheme.plot_palette};
    plot_layout.width = 800 as any;
    plot_layout.height = 560 as any;

    let plot_config = {...PlotConfigurations.configs, response:true};

    let handle_select_index = (index: string,multi_selection?:boolean)=>{
        if(multi_selection=== undefined) multi_selection = false;
        props.results.add_data_series(selected_source, selected_output, selected_channel, index,multi_selection);

        let [timebase, data] = props.results.get_data_series();
        let new_legend:EmulatorResultLegendItem[]= []
        set_data(data.map((item: any, index: number)=>{
            new_legend.push({
                name:item.name,
                index: index
            })
            return({
                name:item.name,
                x: timebase,
                y: item.content,
                type: 'scatter',
                mode: 'lines'
            })
        }));
        set_plot_legends(new_legend);
        set_selected_index(index);
        update_data();
    }

    let add_input_to_plot = (input_name: string,multi_selection:boolean) =>{
        props.results.add_input(selected_source, input_name, multi_selection);
        let [timebase, data] = props.results.get_data_series();
        let new_legend: EmulatorResultLegendItem[]= []
        set_data(data.map((item: any, index: number)=>{
            new_legend.push({
                name:item.name,
                index: index
            })
            return({
                name:item.name,
                x: timebase,
                y: item.content,
                type: 'scatter',
                mode: 'lines'
            })
        }));
        set_plot_legends(new_legend);
        set_selected_output(input_name);
        update_data();
    }

    let handle_select_source = (source: string) =>{
        let srcs = props.results.get_data_sources();
        let inputs_mode = false;
        if(srcs.n_inputs > 0){
            if(srcs.sources.slice(srcs.sources.length-srcs.n_inputs,srcs.sources.length).includes(source)){
                inputs_mode = true;
            }
        }
        set_inputs_mode(inputs_mode);
        set_selected_source(source);
        set_selected_output("");
        set_selected_channel("");
        set_selected_index("");
    }

    let handle_select_output = (output: string, multi_selection?:boolean) =>{
        if(multi_selection=== undefined) multi_selection = false;
        if(inputs_mode){
            add_input_to_plot(output,multi_selection);
        } else {
            set_selected_output(output);
            set_selected_channel("");
            set_selected_index("");
        }
    }

    let handle_select_channel = (channel: string) =>{
        set_selected_channel(channel);
        set_selected_index("");
    }

    return(
        <div style={{
            display:"flex",
            flexDirection:"column",
            gap:10,
            height:"100%",
            margin:10,
            flexGrow:1,
            minWidth:0
        }}>
            <UIPanel key="emulation_result_plots" level="level_2">
                <SimpleContent name="Results Plot" height="100%">
                    <div style={{
                        display:"flex",
                        flexDirection:"row",
                        gap:10,
                        height:"100%"
                    }}>
                        <Plot
                            data={data}
                            layout={plot_layout}
                            config={plot_config}
                            revision={data_revision}
                        />
                        <ResultsPlotLegend data={plot_legends}/>
                    </div>
                </SimpleContent>
            </UIPanel>
            <div style={{
                display:"flex",
                flexDirection:"row",
                minHeight:"300px",
                gap:10
            }}>
                <UIPanel style={{flexGrow:1}} key="emulation_result_core_sel" level="level_2">
                    <SimpleContent name="Core Selector" height="100%">
                        <div>
                            <SelectableList style={{maxHeight:"15em"}} items={props.results.get_data_sources().sources} selected_item={selected_source} onSelect={handle_select_source} />
                        </div>
                    </SimpleContent>
                </UIPanel>
                <UIPanel style={{flexGrow:1}} key="emulation_result_data_sel" level="level_2">
                    <SimpleContent name="Data Selector" height="100%" >
                        <div>
                            <SelectableList
                                style={{maxHeight:"15em"}}
                                items={props.results.get_available_data_series(selected_source)}
                                selected_item={selected_output}
                                onSelect={handle_select_output}
                            />
                        </div>
                    </SimpleContent>
                </UIPanel>
                <UIPanel style={{flexGrow:1}} key="emulation_channel_select" level="level_2">
                    <SimpleContent name="Channel Selector" height="100%" >
                        <div>
                            <SelectableList
                                style={{maxHeight:"15em"}}
                                multi_select
                                items={props.results.get_series_channels(selected_source, selected_output)}
                                selected_item={selected_channel}
                                onSelect={handle_select_channel}
                            />
                        </div>
                    </SimpleContent>
                </UIPanel>
                <UIPanel style={{flexGrow:1}} key="emulation_array_select" level="level_2">
                    <SimpleContent name="Array selector" height="100%">
                        <div>
                            <SelectableList
                                style={{maxHeight:"15em"}}
                                multi_select
                                items={props.results.get_array_indices(selected_source,selected_output)}
                                selected_item={selected_index}
                                onSelect={handle_select_index}
                            />
                        </div>
                    </SimpleContent>
                </UIPanel>
            </div>
        </div>


);
};


export default EmulationResults;
