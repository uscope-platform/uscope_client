// Copyright 2025 Filippo Savi
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

// Custom plotly bundle for the scope: only the scatter traces, rendered with WebGL (scattergl), the SVG renderer of
// plotly-basic-dist can't keep up with the stream of frames
import type PlotlyTypes from 'plotly.js';
import Plotly from 'plotly.js/lib/core';
import scatter from 'plotly.js/lib/scatter';
import scattergl from 'plotly.js/lib/scattergl';
import createPlotlyComponent from 'react-plotly.js/factory';

Plotly.register([scatter, scattergl]);

type Restyle = typeof PlotlyTypes.restyle;

// The update carries one Float32Array per trace, which the Plotly typings of restyle don't accept (Datum[][] only), the
// rest of the signature is Plotly's own
export const ScopePlotly: {
    restyle: (graph_div: Parameters<Restyle>[0], update: Record<string, unknown>, traces: number[]) => ReturnType<Restyle>
} = Plotly;
export const ScopePlot = createPlotlyComponent(Plotly);
