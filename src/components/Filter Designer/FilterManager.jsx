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
    ColorTheme,
    SimpleContent,
    UIPanel
} from "../UI_elements";

import {Responsive, WidthProvider} from "react-grid-layout";
import FilterPlot from "./FilterPlot";
import FilterDesignerControls from "./FilterDesignerControls";
import {filter_calculate_keepouts} from "../../client_core";
import {useSelector} from "react-redux";
import {up_filter} from "../../client_core/data_models/up_filter";
import {MdBuild} from "react-icons/md";
import {Tooltip} from "react-tooltip";

import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

let FilterManager = props =>{

    const [filter_revision, set_filter_revision] = useState( 0);

    const filters_store = useSelector(state => state.filters);
    const settings = useSelector(state => state.settings);

    const ResponsiveGridLayout = WidthProvider(Responsive);

    let selected_filter = settings.selected_filter ? new up_filter(filters_store[settings.selected_filter]): up_filter.construct_empty(0);

    const [keepout_shapes, set_keepout_shapes] = useState([]);

    const [plot_filter, set_plot_filter] = useState({x:0, y:0})

    useEffect(() => {
        set_keepout_shapes(filter_calculate_keepouts(selected_filter.parameters));
    }, [filter_revision]);

    useEffect(() => {
        set_filter_revision(filter_revision+1)
        set_plot_filter({x:[], y:[]});
    }, [settings.selected_filter]);

    let handleBuild = () =>{
        selected_filter.build().then((resp)=>{
            set_plot_filter({x:resp["frequency"], y:resp["response"]});
        }).catch((err)=>{
            toast.error(err);
        })
    }


    let handleParamChanges = (param_name, value) =>{
        set_filter_revision(filter_revision+1)
        selected_filter.edit_parameter(param_name, value).then();
    }

    let handleRename = (param_name, value) =>{
        set_filter_revision(filter_revision+1)
        selected_filter.edit_field(param_name, value).then();
    }

    return(
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                rowHeight={30}
                useCSSTransforms={false}
            >
                <UIPanel key="filter_designer_plot" data-grid={{x: 0, y: 0, w: 10, h: 15, static: true}} level="level_2">
                    <SimpleContent name="Filter Viewer" content={
                        <FilterPlot
                            keepout_shapes={keepout_shapes}
                            f_sample={selected_filter.parameters.sampling_frequency}
                            data_x={plot_filter.x}
                            data_y={plot_filter.y}
                        />
                    }/>
                </UIPanel>
                <UIPanel key="filter_designer_controls" data-grid={{x:10, y: 0, w: 14, h: 15, static: true}} level="level_2">
                    <SimpleContent name="Design Parameters" content={
                        <div>
                            <div style={{display:"flex", marginRight:"0.5em", justifyContent:"right"}}>
                                <div id="build">
                                    <MdBuild onClick={handleBuild} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
                                    <Tooltip anchorId="build" content={"Build Filter"} place="top" />
                                </div>
                            </div>
                            <FilterDesignerControls
                                name={selected_filter.name}
                                filter_parameters={selected_filter.parameters}
                                on_change={handleParamChanges}
                                on_rename={handleRename}
                            />
                        </div>
                    }/>
                </UIPanel>
                <UIPanel key="filter_implementation_controls" data-grid={{x:0, y: 15, w: 24, h: 8, static: true}} level="level_2">
                    <SimpleContent name="Implementation Parameters" content={
                        <div></div>
                    }/>
                </UIPanel>
            </ResponsiveGridLayout>
        </>

    );


}

export default FilterManager;