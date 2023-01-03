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

import React from 'react';
import {useSelector} from "react-redux";

import ChannelSelector from "./ChannelSelector";
import PlotComponent from "./PlotComponent";
import ParametersArea from "./ParametersArea";
import MacroActions from "./MacroActions";
import {ColorTheme, StyledScrollbar} from "../UI_elements";
import TerminalComponent from "./Terminal";
import {DockLayout} from "rc-dock";


let PlotTab = function (props) {
    const channels = useSelector(state => state.channels);
    const settings = useSelector(state => state.settings);



    const defaultLayout = {
        dockbox: {
            mode: 'vertical',
            children: [
                {
                    mode: 'horizontal',
                    children: [
                        {
                            size:40,
                            tabs: [{id: "ch_selector", title:"Channel Selector", content:<ChannelSelector channels={channels}/>}],
                        },
                        {

                            tabs: [{id: "plot", title:"Scope", content:<PlotComponent palette={{colorway:ColorTheme.plot_palette}} refreshRate={settings.refreshRate}/>}],
                        }
                    ]
                },
                {
                    mode: 'horizontal',
                    size: 80,
                    children: [
                        {
                            size:90,
                            tabs: [{id: "parameters", title:"Parameters Section", content:
                                <StyledScrollbar>
                                    <ParametersArea />
                                </StyledScrollbar>

                            }],
                        },
                        {
                            tabs: [{id: "macro", title:"Macro Section", content:<MacroActions />}],
                        }
                    ]
                },
                {
                    size: 90,
                    tabs: [{id: "terminal", title:"Terminal", content:<TerminalComponent/>}],
                }
            ]
        }
    };


        return(
            <DockLayout defaultLayout={defaultLayout} style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10}}/>
        );
};




export default PlotTab;
