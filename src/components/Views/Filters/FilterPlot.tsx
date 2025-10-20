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

import React, {useEffect, useState} from 'react';


import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory.js';
import {ColorTheme} from "#UI/index.js";

//@ts-ignore  //Plotly is only typed for CommonJS, not for ES6 modules.
const Plot = createPlotlyComponent(Plotly);

interface FilterPlotProps {
    plot_data: any,
    f_sample: number,
    keepout_shapes: any,
}



let  FilterPlot = (props: FilterPlotProps) =>{

    const [data_rev, set_data_rev] = useState(1);
    const initial_plot_state : Record<string, any>= {
        margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 25,
        },
        showlegend:false,
        width: 530,
        height:400,
        data_revision:data_rev,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor:"#444",
        font: {
            color: '#FFFFFF'
        },
        xaxis: {
            showline: true,
            showgrid: true,
            tickcolor: '#FFFFFF',
            linecolor: '#FFFFFF',
            gridcolor: '#777777',
            range:[0, props.f_sample]
        },
        yaxis: {
            automargin: true,
            showline: true,
            showgrid: true,
            tickcolor: '#FFFFFF',
            linecolor: '#FFFFFF',
            gridcolor: '#777777',
            range:[-90,10]
        },
        shapes: []
    }

    const [plot_layout, set_plot_layout] = useState(initial_plot_state);

    const [plot_data, set_plot_data] = useState(
        [
                {
                    x: props.plot_data.ideal.x,
                    y: props.plot_data.ideal.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: {
                        color: 'rgb(250,55,55)',
                        width: 3,
                        opacity: 1,
                    }
                },
                {
                    x: props.plot_data.quantized.x,
                    y: props.plot_data.quantized.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: {
                        color: 'rgb(34,154,90)',
                        width: 3,
                        opacity: 1,
                    }
                }
                ]
    );

    let update_layout = (prop: string, value: any)=>{
        let new_layout= plot_layout;
        new_layout[prop] = value;
        set_plot_layout(new_layout);
        set_data_rev(data_rev +1);
    }

    useEffect(() => {
        update_layout("shapes", props.keepout_shapes);
    }, [props.keepout_shapes]);

    useEffect(()=>{
        let x_axis = plot_layout.xaxis;
        x_axis.range =  [0, (props.f_sample/2)*1.05];
        update_layout("xaxis", x_axis);
    }, [props.f_sample])

    let calculate_y_range = (data: any) =>{
        if(data.quantized.y || data.ideal.y){
            let y_base = [...data.ideal.y];
            if(data.quantized.y) y_base = [...y_base, ...data.quantized.y];
            let max_y = Math.max(...y_base, 10);
            let min_y= Math.min(...y_base, -90);

            let y_axis = plot_layout.yaxis;
            y_axis.range =  [min_y*1.1, max_y*1.1];
            update_layout("yaxis", y_axis);
        }
    }

    useEffect(() => {
        let new_data: any = plot_data;
        new_data[0].x = props.plot_data.ideal.x;
        new_data[0].y = props.plot_data.ideal.y;
        set_plot_data(new_data)

        calculate_y_range(props.plot_data);

    }, [props.plot_data.ideal.x, props.plot_data.ideal.y]);

    useEffect(() => {
        let new_data: any= plot_data;
        new_data[1].x = props.plot_data.quantized.x;
        new_data[1].y = props.plot_data.quantized.y;
        set_plot_data(new_data)

        calculate_y_range(props.plot_data);

    }, [props.plot_data.quantized.x, props.plot_data.quantized.y]);

    return(
        <Plot
            data={plot_data}
            config={{responsive: true, displaylogo: false}}
            layout={{...plot_layout,colorway:ColorTheme.plot_palette}}


        />
    );
};

export default FilterPlot;
