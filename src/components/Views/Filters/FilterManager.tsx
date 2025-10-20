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
} from "#UI/index.js";

import FilterPlot from "./FilterPlot.jsx";
import FilterDesignerControls from "./FilterDesignerControls.js";
import {
    filter_calculate_keepouts,
    up_filter
} from "#client_core/index.js";
import {MdBuild, MdConstruction} from "react-icons/md";
import {Tooltip} from "react-tooltip";

import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FilterImplementationControls from "./FilterImplementationControls.js";
import FilterSidebar from "./FilterSidebar.jsx";
import {useAppSelector} from "#redux/hooks.js";

interface FilterManagerProps {

}

let FilterManager = (props: FilterManagerProps) =>{

    const [filter_revision, set_filter_revision] = useState( 0);

    const filters_store = useAppSelector(state => state.filters);

    const [selected_filter, set_selected_filter] = useState(up_filter.construct_empty(9999));

    const [keepout_shapes, set_keepout_shapes] = useState([] as any[]);

    const [plot_filter, set_plot_filter] = useState({ideal:{x:[], y:[]}, quantized:{x:[], y:[]}})

    let handle_select = (flt: number) =>{
        let flt_obj = filters_store[flt];
        if(flt_obj === undefined) return;
        set_selected_filter( new up_filter(flt_obj) );
    }

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
    }, [selected_filter]);

    let handleDesign = async () =>{
        let filter = await selected_filter.design();
        try {
            set_plot_filter({ideal: {x:filter["frequency"], y:filter["response"]}, quantized: plot_filter.quantized});
        } catch (err: any) {
            toast.error(err);
        }
    }
    let handleImplement = () =>{
        selected_filter.implement().then((resp)=>{
            set_plot_filter({ideal: plot_filter.ideal, quantized: {x:resp["frequency"], y:resp["response"]}});
        }).catch((err)=>{
            toast.error(err);
        })
    }


    let handleParamChanges = (param_name: string, value: any) =>{
        set_filter_revision(filter_revision+1)
        selected_filter.edit_parameter(param_name, value).then();
    }

    let handleRename = (param_name: string, value: any) =>{
        set_filter_revision(filter_revision+1)
        selected_filter.edit_field(param_name as keyof up_filter, value).then();
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
                        <SimpleContent name="Filter Viewer">
                            <FilterPlot
                                keepout_shapes={keepout_shapes}
                                f_sample={selected_filter.parameters.sampling_frequency}
                                plot_data={plot_filter}
                            />
                        </SimpleContent>
                    </UIPanel>
                    <UIPanel key="filter_designer_controls" style={{flexGrow: 1}}
                             level="level_2">
                        <SimpleContent name="Design Parameters">
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
                        </SimpleContent>
                    </UIPanel>
                </div>
                <UIPanel key="filter_implementation_controls" style={{flexGrow: 1}}
                         level="level_2">
                    <SimpleContent name="Implementation Parameters">
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
                    </SimpleContent>
                </UIPanel>
            </div>
            <div style={{
                minWidth:"300px",
                height: "100%"
            }}>
                <FilterSidebar on_select={handle_select}/>
            </div>
        </div>
    );


}

export default FilterManager;