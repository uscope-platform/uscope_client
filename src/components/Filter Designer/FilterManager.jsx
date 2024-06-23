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

import React, {useEffect, useState} from "react";
import {
    ColorTheme,
    SimpleContent,
    UIPanel
} from "../UI_elements";

import FilterPlot from "./FilterPlot";
import FilterDesignerControls from "./FilterDesignerControls";
import {filter_calculate_keepouts} from "../../client_core";
import {useSelector} from "react-redux";
import {up_filter} from "../../client_core/data_models/up_filter";
import {MdBuild, MdConstruction} from "react-icons/md";
import {Tooltip} from "react-tooltip";

import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FilterImplementationControls from "./FilterImplementationControls";
import FilterSidebar from "../Sidebar/FilterSidebar";

let FilterManager = props =>{

    const [filter_revision, set_filter_revision] = useState( 0);

    const filters_store = useSelector(state => state.filters);
    const settings = useSelector(state => state.settings);


    let selected_filter = settings.selected_filter ? new up_filter(filters_store[settings.selected_filter]): up_filter.construct_empty(0);

    const [keepout_shapes, set_keepout_shapes] = useState([]);

    const [plot_filter, set_plot_filter] = useState({ideal:{x:0, y:0}, quantized:{x:0, y:0}})

    useEffect(() => {
        set_keepout_shapes(filter_calculate_keepouts(selected_filter.parameters));
    }, [filter_revision]);

    useEffect(() => {
        set_filter_revision(filter_revision+1)
        selected_filter.get_plots().then((resp)=>{
            set_plot_filter({
                ideal: {x:resp.ideal.frequency, y:resp.ideal.response},
                quantized:  {x:resp.quantized.frequency, y:resp.quantized.response}
            });

        })
        set_plot_filter({ideal: {x:[], y:[]}, quantized: {x:[], y:[]}});
    }, [settings.selected_filter]);

    let handleDesign = () =>{
        selected_filter.design().then((resp)=>{
            set_plot_filter({ideal: {x:resp["frequency"], y:resp["response"]}, quantized: plot_filter.quantized});
        }).catch((err)=>{
            toast.error(err);
        })
    }
    let handleImplement = () =>{
        selected_filter.implement().then((resp)=>{
            set_plot_filter({ideal: plot_filter.ideal, quantized: {x:resp["frequency"], y:resp["response"]}});
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

    return (
        <div style={{
            display: "flex",
            flexDirection:"row",
            gap:10,
            height: "100%"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flexGrow:1,
                height: "100%"
            }}>
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
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10
                }}>
                    <UIPanel key="filter_designer_plot" level="level_2" style={{flexGrow: 1}}>
                        <SimpleContent name="Filter Viewer" content={
                            <FilterPlot
                                keepout_shapes={keepout_shapes}
                                f_sample={selected_filter.parameters.sampling_frequency}
                                plot_data={plot_filter}
                            />
                        }/>
                    </UIPanel>
                    <UIPanel key="filter_designer_controls" style={{flexGrow: 1}}
                             level="level_2">
                        <SimpleContent name="Design Parameters" content={
                            <div>
                                <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
                                    <div id="design">
                                        <MdBuild onClick={handleDesign} size={ColorTheme.icons_size}
                                                 style={{marginLeft: "0.3em"}} color={ColorTheme.icons_color}/>
                                        <Tooltip anchorId="design" content={"Design Filter"} place="top"/>
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
                </div>
                <UIPanel key="filter_implementation_controls" style={{flexGrow: 1}}
                         level="level_2">
                    <SimpleContent name="Implementation Parameters" content={
                        <div>
                            <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
                                <div id="implement">
                                    <MdConstruction onClick={handleImplement} size={ColorTheme.icons_size}
                                                    style={{marginLeft: "0.3em"}} color={ColorTheme.icons_color}/>
                                    <Tooltip anchorId="implement" content={"Implement Filter"} place="top"/>
                                </div>
                            </div>
                            <FilterImplementationControls
                                filter_parameters={selected_filter.parameters}
                                on_change={handleParamChanges}
                            />
                        </div>
                    }/>
                </UIPanel>
            </div>
            <div style={{
                minWidth:"300px",
                height: "100%"
            }}>
                <FilterSidebar/>
            </div>
        </div>
    );


}

export default FilterManager;