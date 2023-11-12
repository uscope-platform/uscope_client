// Copyright 2023 Filippo Savi
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
import CoreMemoriesList from "./CoreMemoriesList";
import {Responsive, WidthProvider} from "react-grid-layout";


const ResponsiveGridLayout = WidthProvider(Responsive);

let EmulationResults = function (props) {

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            useCSSTransforms={false}
        >
            <UIPanel key="emulation_result_plots" data-grid={{x: 0, y: 0, w: 14, h: 16, static: true}} level="level_2">
                <SimpleContent name="Results Plot" height="100%" content={
                    <div><p>test 1</p></div>
                }/>
            </UIPanel>
            <UIPanel key="emulation_result_core_sel" data-grid={{x: 14, y: 0, w: 6, h: 8, static: true}} level="level_2">
                <SimpleContent name="Core Selector" height="100%" content={
                    <div><p>test 2</p></div>
                }/>
            </UIPanel>
            <UIPanel key="emulation_result_data_sel" data-grid={{x: 14, y: 8, w: 6, h: 8, static: true}} level="level_2">
                <SimpleContent name="Data Selector" height="100%" content={
                    <div><p>test 2</p></div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>


);
};


export default EmulationResults;
