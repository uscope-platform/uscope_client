// Copyright 2024 Filippo Savi
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

export const PlotConfigurations = {
    layout: {
        margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 25,
        },
        showlegend:false,
        width: 1024,
        height:330,
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
            gridcolor: '#777777'
        },
        yaxis: {
            automargin: true,
            showline: true,
            showgrid: true,
            tickcolor: '#FFFFFF',
            linecolor: '#FFFFFF',
            gridcolor: '#777777'
        }
    },
    configs: {
        responsive: true,
        displaylogo: false
    },
    refresh_rate:150
};