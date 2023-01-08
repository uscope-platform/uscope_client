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
import {ColorTheme, UIPanel, SimpleContent} from "../UI_elements";
import TerminalComponent from "./Terminal";
import {Responsive, WidthProvider} from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

let PlotTab = function (props) {
    const channels = useSelector(state => state.channels);
    const settings = useSelector(state => state.settings);

        return(
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                rowHeight={30}
                useCSSTransforms={false}
            >
                <UIPanel key="ch_selector" data-grid={{x: 0, y: 0, w: 3, h: 10, static: true}} level="level_2">
                    <SimpleContent name="Channel Selector" content={
                        <ChannelSelector channels={channels}/>
                    }/>
                </UIPanel>
                <UIPanel key="props" data-grid={{x: 3, y: 0, w: 21, h: 10, static: true}} level="level_2">
                    <SimpleContent name="Scope" content={
                        <PlotComponent palette={{colorway:ColorTheme.plot_palette}} refreshRate={settings.refreshRate}/>
                    }/>
                </UIPanel>
                <UIPanel key="parameters" data-grid={{x: 0, y: 10, w: 4, h: 7, static: true}} level="level_2">
                    <SimpleContent name="Parameters" content={
                        <ParametersArea />
                    }/>
                </UIPanel>
                <UIPanel key="macro" data-grid={{x: 4, y: 10, w: 20, h: 7, static: true}} level="level_2">
                    <SimpleContent name="Macro" content={
                        <MacroActions />
                    }/>
                </UIPanel>
                <UIPanel key="terminal" data-grid={{x:1, y: 17, w: 20, h: 8, static: true}} level="level_2">
                    <SimpleContent name="Terminal" content={
                        <TerminalComponent/>
                    }/>
                </UIPanel>
            </ResponsiveGridLayout>
        );
};




export default PlotTab;
