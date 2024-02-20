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
import {SimpleContent, UIPanel} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";


const ResponsiveGridLayout = WidthProvider(Responsive);

let HilControl = function (props) {

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            useCSSTransforms={false}
        >
            <UIPanel key="hil_scope" data-grid={{x: 0, y: 0, w: 24, h: 16, static: true}} level="level_2">
                <SimpleContent name="Scope" height="100%" content={
                    <p>SCOPE</p>
                }/>
            </UIPanel>
            <UIPanel key="Hil_inputs" data-grid={{x: 0, y: 16, w: 10, h: 8, static: true}} level="level_2">
                <SimpleContent name="Inputs" height="100%" content={
                    <p>INPUTS</p>
                }/>
            </UIPanel>
            <UIPanel key="hil_channel_selector" data-grid={{x: 14, y: 16, w: 10, h: 8, static: true}} level="level_2">
                <SimpleContent name="Channel Selector" height="100%" content={
                    <p>CHANNEL SELECTOR</p>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>


    );
};


export default HilControl;
