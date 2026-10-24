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

import React, {useEffect, useMemo, useState} from "react";
import {
    SimpleContent,
    Toolbar,
    ToolbarButton,
    UIPanel
} from "#UI/index.js";
import {MainPane, PaneGroup} from "#UI/index.js";

import FilterPlot from "./FilterPlot.jsx";
import FilterDesignerControls from "./FilterDesignerControls.js";
import {
    filter_calculate_keepouts,
    up_filter
} from "#client_core/index.js";
import {MdAutoFixHigh, MdConstruction} from "react-icons/md";

import {report_error} from "#client_core/proxy/errors.js";
import 'react-toastify/dist/ReactToastify.css';
import FilterImplementationControls from "./FilterImplementationControls.js";
import FilterSidebar from "./FilterSidebar.jsx";
import {useAppSelector} from "#redux/hooks.js";

interface FilterManagerProps {

}

let FilterManager = (props: FilterManagerProps) =>{

    const filters_store = useAppSelector(state => state.filters);

    const [selected_id, set_selected_id] = useState(9999);

    const [plot_filter, set_plot_filter] = useState({ideal:{x:[], y:[]}, quantized:{x:[], y:[]}})

    // read from the store, so that what is edited from the list or from here shows right away; the editor is for a
    // filter of the store, the empty one it starts with (or a deleted one) is not
    const stored_filter = filters_store[selected_id];
    const has_selection = stored_filter !== undefined;
    const selected_filter = useMemo(
        () => stored_filter !== undefined ? new up_filter(stored_filter) : up_filter.construct_empty(9999),
        [stored_filter]
    );
    const keepout_shapes = useMemo(
        () => has_selection ? filter_calculate_keepouts(selected_filter.parameters) : [],
        [selected_filter]
    );

    let handle_select = (flt: number) =>{
        if(filters_store[flt] === undefined) return;
        set_selected_id(flt);
    }

    // the response is the one of the filter that is selected, whatever is edited in its parameters
    useEffect(() => {
        if(!has_selection) return;
        set_plot_filter({ideal: {x:[], y:[]}, quantized: {x:[], y:[]}});
        // a filter that was never designed has no response to plot
        if(selected_filter.ideal_taps.length === 0) return;
        selected_filter.get_plots().then((resp)=>{
            set_plot_filter({
                ideal: {x:resp.ideal.frequency, y:resp.ideal.response},
                quantized:  {x:resp.quantized.frequency, y:resp.quantized.response}
            });

        }).catch(report_error)
    }, [selected_id, has_selection]);

    let handleDesign = async () =>{
        try {
            let filter = await selected_filter.design();
            set_plot_filter({ideal: {x:filter["frequency"], y:filter["response"]}, quantized: plot_filter.quantized});
        } catch (err: any) {
            report_error(err);
        }
    }
    let handleImplement = () =>{
        selected_filter.implement().then((resp)=>{
            set_plot_filter({ideal: plot_filter.ideal, quantized: {x:resp["frequency"], y:resp["response"]}});
        }).catch(report_error)
    }


    let handleParamChanges = (param_name: string, value: any) =>{
        selected_filter.edit_parameter(param_name, value).then();
    }

    return (
        <PaneGroup id="filters" orientation="horizontal">
            <MainPane>
                {!has_selection ? (
                    <PaneGroup id="filter_none" orientation="vertical">
                        <UIPanel id="filter" key="no_filter" level="level_2">
                            <SimpleContent name="Filter">
                                <div style={{margin: "1em", opacity: 0.6}}>Select a filter or add a new one</div>
                            </SimpleContent>
                        </UIPanel>
                    </PaneGroup>
                ) : (
                    <PaneGroup id="filter_main" orientation="vertical">
                        <UIPanel id="viewer" key="filter_designer_plot" level="level_2" default_size={60} min_size="10em" collapsible={false}>
                            <div style={{flex: 1, minHeight: 0}}>
                                <FilterPlot
                                    keepout_shapes={keepout_shapes}
                                    f_sample={selected_filter.parameters.sampling_frequency}
                                    plot_data={plot_filter}
                                />
                            </div>
                        </UIPanel>
                        <UIPanel id="implementation" key="filter_parameters" level="level_2" default_size={40} min_size="8em" collapsible={false}>
                            <Toolbar>
                                <ToolbarButton label="Design" tooltip="Design Filter" icon={<MdAutoFixHigh size="1.5em"/>} onClick={handleDesign}/>
                                <ToolbarButton label="Implement" tooltip="Implement Filter" icon={<MdConstruction size="1.5em"/>} onClick={handleImplement}/>
                            </Toolbar>
                            <div style={{flex: 1, minHeight: 0, overflowY: "auto"}}>
                                <FilterDesignerControls
                                    name={selected_filter.name}
                                    filter_parameters={selected_filter.parameters}
                                    on_change={handleParamChanges}
                                />
                                <FilterImplementationControls
                                    filter_parameters={selected_filter.parameters}
                                    on_change={handleParamChanges}
                                />
                            </div>
                        </UIPanel>
                    </PaneGroup>
                )}
            </MainPane>
            <FilterSidebar on_select={handle_select}/>
        </PaneGroup>
    );


}

export default FilterManager;