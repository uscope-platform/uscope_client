// Copyright 2021 Filippo Savi
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
import createPlotlyComponent from 'react-plotly.js/factory';
import {useSelector} from "react-redux";

const Plot = createPlotlyComponent(Plotly);



let  FilterPlot = props =>{

    const settings = useSelector(state => state.settings);
    const [data_rev, set_data_rev] = useState(1);

    const [plot_layout, set_plot_layout] = useState({
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
    });

    const [plot_data, set_plot_data] = useState(
        [
                {
                    x: props.data_x,
                    y: props.data_y,
                    type: 'scatter',
                    mode: 'lines'
                }
                ]
    );

    useEffect(() => {
        let new_layout= plot_layout;
        new_layout["shapes"] = props.keepout_shapes;
        set_plot_layout(new_layout);
        set_data_rev(data_rev +1);
    }, [props.keepout_shapes]);

    useEffect(()=>{
        let new_layout= plot_layout;
        new_layout.xaxis.range = [0, (props.f_sample/2)*1.05];
        set_plot_layout(new_layout);
        set_data_rev(data_rev +1);
    }, [props.f_sample])

    useEffect(() => {
        let new_data= plot_data;
        new_data[0].x = props.data_x;
        new_data[0].y = props.data_y;
        set_plot_data(new_data)
        set_data_rev(data_rev +1);
    }, [props.data_x, props.data_y]);

    return(
        <Plot
            data={plot_data}
            config={{responsive: true, displaylogo: false}}
            layout={{...plot_layout,...settings.plot_palette}}


        />
    );
};

export default FilterPlot;
