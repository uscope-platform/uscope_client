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

import {mock_store} from "../client_core/mock/redux_store";
import {initialize_channels, plotPause, plotPlay, plotStop} from "../../src/redux/Actions/plotActions";
import {create_plot_channel} from "../../src/client_core";


test("plot_play/pause", () =>{
    let plot = mock_store.getState().plot;
    expect(plot.plot_running).toBe(false);
    mock_store.dispatch(plotPlay())
    plot = mock_store.getState().plot;
    expect(plot.plot_running).toBe(true);
    mock_store.dispatch(plotPause())
    plot = mock_store.getState().plot;
    expect(plot.plot_running).toBe(false);
})

let ch = create_plot_channel({
    name: "test",
    id: "test".replace(/\s/g, "_").toLowerCase(),
    phys_width:16,
    number: 0,
    mux_setting: 0,
    enabled: false,
    max_value: "1000",
    min_value: "0"
});
let initial_ch = [ch, ch, ch];

test("plot_initialize", () => {
    let plot = mock_store.getState().plot;
    let dr = plot.datarevision;
    mock_store.dispatch(initialize_channels(initial_ch))
    plot = mock_store.getState().plot;
    expect(plot.datarevision).toBe(dr+1)
    expect(plot.data).toStrictEqual(initial_ch)
})


test("plot_stop", () =>{
    mock_store.dispatch(initialize_channels(initial_ch))
    mock_store.dispatch(plotPlay())
    let plot = mock_store.getState().plot;
    let dr = plot.datarevision;
    expect(plot.plot_running).toBe(true);
    mock_store.dispatch(plotStop())
    plot = mock_store.getState().plot;
    expect(plot.plot_running).toBe(false);
    expect(plot.datarevision).toBe(dr+1)
    initial_ch[0].visible = false;
    initial_ch[1].visible = false;
    initial_ch[2].visible = false;
    expect(plot.data).toStrictEqual(initial_ch)
})