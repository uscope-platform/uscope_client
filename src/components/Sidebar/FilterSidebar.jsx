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

import React, {useEffect, useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {
    SelectableList,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import {setSetting} from "../../redux/Actions/SettingsActions";
import SideToolbar from "./SideToolbar";
import {download_json, get_next_id, up_program, up_script, upload_json} from "../../client_core";
import {up_filter} from "../../client_core/data_models/up_filter";


let  FilterSidebar = props =>{

    const filters_store = useSelector(state => state.filters);
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    useEffect(() => {
        return() =>{
            dispatch(setSetting(["selected_filter", null]));
        }
    },[dispatch]);

    const ResponsiveGridLayout = WidthProvider(Responsive);

    let selected_filter = {name:""};
    if(settings.selected_filter)
        selected_filter = filters_store[settings.selected_filter];
    

    let handleOnSelect = (selection) => {
        if(settings.selected_filter !==selection){
            let selected_filter = Object.values(filters_store).filter((filter)=>{
                return filter.name === selection;
            })[0];
            dispatch(setSetting(["selected_filter", selected_filter.id]));
        }
    };

    let handleAdd = () =>{
        let id = get_next_id(Object.values(filters_store).map(a => a.id).sort());
        let filter_obj = up_filter.construct_empty(id);
        filter_obj.add_remote().then();
    };

    let handleRemove = (filter_name) =>{
        let deleted = Object.values(filters_store).filter((flt)=>{
            return flt.name === filter_name;
        })[0];
        dispatch(setSetting(["selected_filter", null]));
        up_filter.delete_filter(deleted).then();
    };

    let handleImport = () =>{
        upload_json().then((flt)=>{
            let filter_obj = new up_filter(JSON.parse(flt));
            filter_obj.add_remote().then();
        }).catch((err)=>{
            alert(err);
        })
    };

    let handleExport = () =>{
        download_json(selected_filter, selected_filter.name);
    };

    let get_content = () =>{
        let types = [];
        let items = Object.values(filters_store).map((filter)=>{
            types.push("generic");
            return filter.name;
        })

        return [items, types]
    }

    const [names, types] = get_content();

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="filters_list" data-grid={{x: 0, y: 0, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name="Filters List" content={
                    <div>
                        <SideToolbar
                            onAdd={handleAdd}
                            onImport={handleImport}
                            onExport={handleExport}
                            contentName="Filter"
                            exportEnabled={settings.selected_filter}
                        />
                        <SelectableList items={names} types={types} selected_item={selected_filter.name} onRemove={handleRemove} onSelect={handleOnSelect} />
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>

    );
};

export default FilterSidebar;


