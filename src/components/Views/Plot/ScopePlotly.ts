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
//@ts-ignore
import Plotly from 'plotly.js/lib/core';
//@ts-ignore
import scatter from 'plotly.js/lib/scatter';
//@ts-ignore
import scattergl from 'plotly.js/lib/scattergl';
//@ts-ignore
import createPlotlyComponent from 'react-plotly.js/factory';

Plotly.register([scatter, scattergl]);

export const ScopePlotly: { restyle: (graph_div: HTMLElement, update: Record<string, unknown>, traces: number[]) => Promise<unknown> } = Plotly;
export const ScopePlot = createPlotlyComponent(Plotly);
