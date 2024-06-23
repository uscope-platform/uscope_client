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
import {SimpleContent, UIPanel} from "../../UI_elements";
import HilChannelSelector from "./HilChannelSelector";
import {useSelector} from "react-redux";
import {up_emulator} from "../../../client_core";
import HilInputsPanel from "./HilInputsPanel";
import HilPlot from "./HilPlot";


let HilPlotTab = function (props) {

    const emulators_store = useSelector(state => state.emulators);
    const settings = useSelector(state => state.settings);

    let selected_emulator = new up_emulator(emulators_store[parseInt(settings.selected_emulator)]);
    if(props.deployed){
        return(

           <div style={{
               display:"flex",
               flexDirection:"column",
               gap:10,
               margin:10
           }}>
               <UIPanel key="hil_scope" data-grid={{x: 0, y: 0, w: 24, h: 16, static: true}} level="level_2">
                   <SimpleContent name="Scope" height="100%" content={
                       <HilPlot refreshRate={125}/>
                   }/>
               </UIPanel>
               <div style={{
                   display:"flex",
                   flexDirection:"row",
                   gap:10
               }}>
                   <UIPanel key="Hil_inputs"  style={{flexGrow:1}} level="level_2">
                       <SimpleContent name="Inputs" height="100%" content={
                           <HilInputsPanel emulator={selected_emulator}/>
                       }/>
                   </UIPanel>
                   <UIPanel key="hil_channel_selector" style={{flexGrow:1}}  level="level_2">
                       <SimpleContent name="Channel Selector" height="100%" content={
                           <HilChannelSelector emulator={selected_emulator}/>
                       }/>
                   </UIPanel>
               </div>
           </div>

        );
    }

};


export default HilPlotTab;
