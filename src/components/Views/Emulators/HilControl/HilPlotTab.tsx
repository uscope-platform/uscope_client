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

import React from 'react';
import {SimpleContent, TabbedContent, UIPanel} from "#UI/index.js";
import HilChannelSelector from "./HilChannelSelector.jsx";
import HilInputsPanel from "./HilInputsPanel.jsx";
import HilPlot from "./HilPlot.jsx";
import {up_emulator} from "#client_core/index.js";


interface HilPlotTabProps {
    emulator: up_emulator,
    deployed: boolean,
    download_data_request: boolean,
    on_download_done: (request: boolean) => void,
    hil_plot_running: boolean
}

let HilPlotTab = function (props: HilPlotTabProps) {

    if(props.deployed){
        let [input_tab_names, inputs, channels] =  props.emulator.get_inputs();
        let [selected_core, set_selected_core] = React.useState(0);
        let [selected_outputs, set_selected_outputs] = React.useState<string[]>([]);


        let render_input_tabs = ()=>{
            let ret_arr = []
            for(let i in inputs){
                let in_arr = inputs[i];
                let n_c = channels[selected_core];
                if(n_c === undefined || in_arr ===undefined) continue;
                ret_arr.push(
                    <HilInputsPanel
                        key={i+ "inputs_tab"}
                        inputs={in_arr}
                        emulator={props.emulator}
                        n_channels={n_c}
                    />
                );
            }
            return ret_arr;
        }
        return(
           <div style={{
               display:"flex",
               flexDirection:"column",
               gap:10,
               margin:10
           }}>
               <UIPanel key="hil_scope" data-grid={{x: 0, y: 0, w: 24, h: 16, static: true}} level="level_2">
                   <SimpleContent name="Scope" height="100%">
                       <HilPlot
                           hil_plot_running={props.hil_plot_running}
                           refreshPeriod={125}
                           download_data_request={props.download_data_request}
                           on_download_done={props.on_download_done}
                           selected_outputs={selected_outputs}
                       />
                   </SimpleContent>
               </UIPanel>
               <div style={{
                   display:"flex",
                   flexDirection:"row",
                   gap:10
               }}>
                   <UIPanel key="Hil_inputs"  style={{flexGrow:0.5}} level="level_2">
                       <TabbedContent names={input_tab_names}  selected={selected_core} onSelect={set_selected_core}>
                           {render_input_tabs()}
                       </TabbedContent>
                   </UIPanel>
                   <UIPanel key="hil_channel_selector" style={{flexGrow:1}}  level="level_2">
                       <SimpleContent name="Channel Selector" height="100%">
                           <HilChannelSelector
                               emulator={props.emulator}
                               set_selected_outputs={set_selected_outputs}
                           />
                       </SimpleContent>
                   </UIPanel>
               </div>
           </div>

        );
    }

};


export default HilPlotTab;
