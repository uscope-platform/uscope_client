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
import {styled} from "goober";
import {MdDelete, MdDownload} from "react-icons/md";
import {ColorTheme, PlotConfigurations, SelectableList, SimpleContent, UIPanel} from "#UI/index.js";

//@ts-ignore
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";

import ResultsPlotLegend from "#components/Views/Emulators/EmulationResults/ResultsPlotLegend.jsx";
import {up_emulator_result} from "#client_core/index.js";
import type {EmulatorResultLegendItem} from "#interfaces/index.js";


const Plot = createPlotlyComponent(Plotly);

const PLOT_CONFIG = {...PlotConfigurations.configs, response: true};
const {width: _fixed_width, height: _fixed_height, ...FLUID_LAYOUT} = PlotConfigurations.layout;
const PLOT_STYLE = {width: "100%", height: "100%"};
// the plot takes what the window leaves to the page header and to the selectors under it
const PLOT_HEIGHT = "max(20em, calc(100vh - 230px - 20em))";

const Toolbar = styled('div')`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0.8rem;
  min-height: 2.2rem;
`

const Actions = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex: 0 0 auto;
`

const Hint = styled('span')`
  font-size: 0.8rem;
  opacity: 0.6;
`

const Columns = styled('div')`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  height: 15em;
`

const Column = styled('div')`
  display: flex;
  flex-direction: column;
  min-width: 0;
  & + & {
    border-left: 1px solid ${ColorTheme.background.borders};
  }
`

const ColumnTitle = styled('div')`
  padding: 0.5rem 0.8rem 0.3rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
`

const ColumnBody = styled('div')`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 0.3rem 0.3rem;
`

const Empty = styled('div')`
  padding: 0.4rem 0.5rem;
  font-size: 0.85rem;
  opacity: 0.5;
`

interface SelectorColumnProps {
    title: string,
    items: string[],
    selected: string,
    // what to do before there is anything to choose from
    empty: string,
    multi_select?: boolean | undefined,
    onSelect: (name: string, multi?: boolean) => void,
}

let SelectorColumn = (props: SelectorColumnProps) => (
    <Column>
        <ColumnTitle>{props.title}</ColumnTitle>
        <ColumnBody>
            {props.items.length === 0
                ? <Empty>{props.empty}</Empty>
                : <SelectableList
                    items={props.items}
                    selected_item={props.selected}
                    {...(props.multi_select ? {multi_select: true} : {})}
                    onSelect={props.onSelect}
                    style={{maxHeight: "none", width: "auto"}}
                />}
        </ColumnBody>
    </Column>
);

interface EmulationResultsProps {
    results: up_emulator_result,
    on_download: () => void,
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

    const plot_layout = {...FLUID_LAYOUT, autosize: true, colorway: ColorTheme.plot_palette};

    // draws what the results have selected
    let refresh_plot = () =>{
        let [timebase, series] = props.results.get_data_series();
        set_data(series.map((item: any) => ({
            name: item.name,
            x: timebase,
            y: item.content,
            type: 'scatter',
            mode: 'lines'
        })));
        set_plot_legends(series.map((item: any, index: number) => ({name: item.name, index: index})));
        update_data();
    }

    let handle_select_index = (index: string,multi_selection?:boolean)=>{
        props.results.add_data_series(selected_source, selected_output, selected_channel, index, multi_selection ?? false);
        refresh_plot();
        set_selected_index(index);
    }

    let add_input_to_plot = (input_name: string,multi_selection:boolean) =>{
        props.results.add_input(selected_source, input_name, multi_selection);
        refresh_plot();
        set_selected_output(input_name);
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

    let handle_clear = () =>{
        props.results.clear_selected_series();
        refresh_plot();
    }

    const icon_style = {cursor: "pointer"};

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
            <UIPanel style={{flex: "0 0 auto"}} key="emulation_result_plots" level="level_2">
                <SimpleContent name="Results Plot" height={PLOT_HEIGHT}>
                  <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                    <Toolbar>
                        {plot_legends.length > 0
                            ? <ResultsPlotLegend data={plot_legends}/>
                            : <Hint>Pick a core, a series, a channel and an index below to plot it. Ctrl+click adds to the plot.</Hint>}
                        <Actions>
                            <MdDelete title="Clear the plot" size={ColorTheme.icons_size} color={ColorTheme.icons_color}
                                      style={icon_style} onClick={handle_clear}/>
                            <MdDownload title="Download the results" size={ColorTheme.icons_size} color={ColorTheme.icons_color}
                                        style={icon_style} onClick={props.on_download}/>
                        </Actions>
                    </Toolbar>
                    <div style={{flex: 1, minHeight: 0}}>
                        <Plot
                            data={data}
                            layout={plot_layout}
                            config={PLOT_CONFIG}
                            style={PLOT_STYLE}
                            useResizeHandler
                            revision={data_revision}
                        />
                    </div>
                  </div>
                </SimpleContent>
            </UIPanel>
            <UIPanel style={{flex: "0 0 auto"}} key="emulation_result_selectors" level="level_2">
                <SimpleContent name="Data">
                    <Columns>
                        <SelectorColumn
                            title="Core"
                            empty="No results yet, run the emulation"
                            items={props.results.get_data_sources().sources}
                            selected={selected_source}
                            onSelect={handle_select_source}
                        />
                        <SelectorColumn
                            title={inputs_mode ? "Input" : "Series"}
                            empty="Select a core"
                            items={props.results.get_available_data_series(selected_source)}
                            selected={selected_output}
                            onSelect={handle_select_output}
                        />
                        <SelectorColumn
                            title="Channel"
                            empty={inputs_mode ? "Not needed for an input" : "Select a series"}
                            multi_select
                            items={props.results.get_series_channels(selected_source, selected_output)}
                            selected={selected_channel}
                            onSelect={handle_select_channel}
                        />
                        <SelectorColumn
                            title="Index"
                            empty={inputs_mode ? "Not needed for an input" : "Select a channel"}
                            multi_select
                            items={props.results.get_array_indices(selected_source,selected_output)}
                            selected={selected_index}
                            onSelect={handle_select_index}
                        />
                    </Columns>
                </SimpleContent>
            </UIPanel>
        </div>
    );
};


export default EmulationResults;
