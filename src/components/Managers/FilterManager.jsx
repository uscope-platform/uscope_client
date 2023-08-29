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

import React from "react";
import {
    SimpleContent,
    UIPanel
} from "../UI_elements";

import {Responsive, WidthProvider} from "react-grid-layout";


let FilterManager = props =>{

    const ResponsiveGridLayout = WidthProvider(Responsive);


    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            useCSSTransforms={false}
        >
            <UIPanel key="filter_designer" data-grid={{x: 0, y: 0, w: 24, h: 5, static: true}} level="level_2">
                <SimpleContent name="Filter Designer" content={
                    <div>

                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );

}

export default FilterManager;