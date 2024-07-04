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

import React, {useState} from 'react';
import {useSelector} from "react-redux";

import ChannelSelector from "./ChannelSelector";
import PlotComponent from "./PlotComponent";
import ParametersArea from "./ParametersArea";
import MacroActions from "./MacroActions";
import {ColorTheme, UIPanel, SimpleContent} from "../UI_elements";
import TerminalComponent from "./Terminal";
import PlotSidebar from "../Sidebar/Plot/PlotSidebar";


let PlotTab = function (props) {
    const channels = useSelector(state => state.channels);

    const [plot_status, set_plot_status] = useState(false);
    const [plot_palette, set_plot_palette] = useState({colorway:ColorTheme.plot_palette})

        return(
            <div style={{
                display:"flex",
                flexDirection:"row",
                gap:10
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    height: "100%"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        width: "100%"
                    }}>
                        <UIPanel key="ch_selector" style={{flexGrow: 0.5}} level="level_2">
                            <SimpleContent name="Channel Selector" content={
                                <ChannelSelector onPaletteChange={set_plot_palette} channels={channels}/>
                            }/>
                        </UIPanel>
                        <UIPanel key="scope" style={{flexGrow: 1}} level="level_2">
                            <SimpleContent name="Scope" content={
                                <PlotComponent
                                    plot_running={plot_status}
                                    palette={plot_palette}
                                    refreshRate={125}
                                />
                            }/>
                        </UIPanel>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        minHeight: "300px"
                    }}>
                        <UIPanel style={{flexGrow: 0.4}} key="parameters" level="level_2">
                            <SimpleContent name="Parameters" content={
                                <ParametersArea/>
                            }/>
                        </UIPanel>
                        <UIPanel style={{flexGrow: 1}} key="macro" level="level_2">
                            <SimpleContent name="Macro" content={
                                <MacroActions/>
                            }/>
                        </UIPanel>
                    </div>
                    <UIPanel key="terminal" level="level_2">
                        <SimpleContent name="Terminal" content={
                            <TerminalComponent/>
                        }/>
                    </UIPanel>
                </div>
                <PlotSidebar on_plot_status_change={set_plot_status}/>
            </div>

        );
};


export default PlotTab;
