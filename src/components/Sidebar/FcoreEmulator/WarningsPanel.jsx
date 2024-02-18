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
import {useSelector} from "react-redux";
import {Responsive, WidthProvider} from "react-grid-layout";
import {SelectableListItem, SimpleContent, UIPanel} from "../../UI_elements";
import {margin} from "plotly.js/src/plots/layout_attributes";

let  WarningsPanel = props =>{

    const settings = useSelector(state => state.settings);


    if(settings.emulator_compile_warning && settings.emulator_selected_component === null){

        const ResponsiveGridLayout = WidthProvider(Responsive);

        let print_warnings = (names, icons) =>{
            let ret = []
            settings.emulator_compile_warning.map((item)=>{

                let warning_string = item[0].source + "." + item[0].name + "[" + item[0].address + "]";
                ret.push(
                    <div key={warning_string}>
                        <p>{warning_string}</p>
                    </div>
                )
                warning_string = item[1].source + "." + item[1].name + "[" + item[1].address + "]";
                ret.push(
                    <div key={warning_string}>
                        <p style={{marginLeft: "2em"}}>{warning_string}</p>
                    </div>
                )

            })
            return ret;
        }

        return(
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                useCSSTransforms={false}
            >
                <UIPanel key="warnings" data-grid={{x: 0, y: 0, w: 24, h: 2, static: true}} level="level_2">
                    <SimpleContent name={"Warnings"} content={
                        <div style={{display:"flex", flexDirection:"column", gap:"0.25em", margin:"0.5em"}}>
                            {print_warnings()}
                        </div>
                    }/>
                </UIPanel>
            </ResponsiveGridLayout>
        )

    }
};

export default WarningsPanel;
