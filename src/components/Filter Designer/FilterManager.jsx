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

import React, {useEffect, useState} from "react";
import {
    SimpleContent,
    UIPanel
} from "../UI_elements";

import {Responsive, WidthProvider} from "react-grid-layout";
import FilterPlot from "./FilterPlot";
import FilterDesignerControls from "./FilterDesignerControls";
import {filter_calculate_keepouts} from "../../client_core";


let FilterManager = props =>{

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const [filter_type, set_filter_type] = useState([true, false, false, false]);
    const [filter_parameters, set_filter_parameters] = useState({
        pass_band_ripple:1,
        stop_band_ripple:2,
        cutoff_frequency:3,
        cut_in_frequency:4,
        cut_off_frequency:5
    });

    const [keepout_shapes, set_keepout_shapes] = useState([]);

    useEffect(() => {
        set_keepout_shapes(filter_calculate_keepouts(filter_type, filter_parameters));
    }, [filter_type, filter_parameters]);

    let handleParamChanges = (change) =>{
        switch (change.type){
            case "select_filter":
                set_filter_type(change.value);
                break;
            default:
                let new_parameters = {...filter_parameters};
                new_parameters[change.type] = parseFloat(change.value);
                set_filter_parameters(new_parameters);
                break;
        }
    }

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            useCSSTransforms={false}
        >
            <UIPanel key="filter_designer_plot" data-grid={{x: 0, y: 0, w: 10, h: 15, static: true}} level="level_2">
                <SimpleContent name="Filter Viewer" content={
                    <FilterPlot keepout_shapes={keepout_shapes} />
                }/>
            </UIPanel>
            <UIPanel key="filter_designer_controls" data-grid={{x:10, y: 0, w: 14, h: 15, static: true}} level="level_2">
                <SimpleContent name="Controls" content={
                    <FilterDesignerControls
                        filter_type={filter_type}
                        filter_parameters={filter_parameters}
                        on_change={handleParamChanges}
                    />
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );

}

export default FilterManager;