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

import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';

import {PlotConfigurations} from "#UI/index.js";
import {apply_scope_data, download_plot, initialize_plot, subscribe_scope_frames} from "#client_core/index.js";
import {latest_scope_data} from "#client_core/proxy/scope_stream.js";
import useInterval from "../../Common_Components/useInterval.js";
import {ApplicationContext} from "#src/AuthApp.jsx";
import type {plot_channel} from "#interfaces/index.js";
import {ScopePlot, ScopePlotly} from "./ScopePlotly.js";

// the plot configuration is static
const PLOT_CONFIG = {...PlotConfigurations.configs, response: true};
// how often the acquisition status is refreshed while the scope is running
const ACQUISITION_STATUS_PERIOD_MS = 1500;

interface PlotComponentProps {
    on_data_init: (data: plot_channel[]) => void;
    selected_group: string;
    request_download: number;
    external_data : plot_channel[];
    plot_status: boolean;
    on_update_acquisition_status: () => void;
    external_revision: number;
    palette: { colorway: string[] }
}

let  PlotComponent = (props: PlotComponentProps) =>{

    const application = useContext(ApplicationContext);
    let init_data:plot_channel[] =[]
    const [plot_data, set_plot_data] = useState(init_data);

    // The frames bypass react: the traces are updated in place and plotly is told directly about it, react only
    // re-renders the plot when its structure (channels, visibility, palette) changes
    const plot_data_ref = useRef(plot_data);
    plot_data_ref.current = plot_data;
    const plot_status_ref = useRef(props.plot_status);
    plot_status_ref.current = props.plot_status;
    const graph_div = useRef<HTMLElement | null>(null);

    const layout = useMemo(() => ({...PlotConfigurations.layout, ...props.palette}), [props.palette]);

    useEffect(()=>{
        let data = initialize_plot(application);
        set_plot_data(data);
        props.on_data_init(data);
    }, [application])

    useEffect(()=>{
        if(plot_data.length > 0){
            download_plot(plot_data, props.selected_group);
        }

    }, [props.request_download])

    useEffect(()=>{
        set_plot_data(props.external_data);
    }, [props.external_data])

    // draws at most once per animation frame, and only when a new frame of data has been received
    useEffect(() => {
        let animation: number | undefined;

        const draw = () => {
            animation = undefined;
            const div = graph_div.current;
            if(!plot_status_ref.current || div === null) return;

            const traces = plot_data_ref.current;
            const updated = apply_scope_data(traces, latest_scope_data());
            if(updated.length === 0) return;
            void ScopePlotly.restyle(
                div,
                {x: updated.map(i => traces[i]!.x), y: updated.map(i => traces[i]!.y)},
                updated
            );
        };

        const unsubscribe = subscribe_scope_frames(() => {
            if(animation === undefined) animation = requestAnimationFrame(draw);
        });
        return () => {
            unsubscribe();
            if(animation !== undefined) cancelAnimationFrame(animation);
        };
    }, [])

    useInterval(() => {
        if(props.plot_status) props.on_update_acquisition_status();
    }, ACQUISITION_STATUS_PERIOD_MS);

    return(
        <ScopePlot
            data={plot_data}
            layout={layout}
            config={PLOT_CONFIG}
            datarevision={props.external_revision}
            onInitialized={(_: unknown, div: HTMLElement) => { graph_div.current = div; }}
            onUpdate={(_: unknown, div: HTMLElement) => { graph_div.current = div; }}
        />
    );
};

export default PlotComponent;
