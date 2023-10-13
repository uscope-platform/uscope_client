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

import React, {useEffect} from 'react';

import {useDispatch, useSelector} from "react-redux";

import {
    SelectableList,
    SimpleContent,
    UIPanel
} from "../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";

import 'react-tooltip/dist/react-tooltip.css'
import SideToolbar from "./SideToolbar";
import {download_json, get_next_id, upload_json} from "../../client_core";
import {setSetting} from "../../redux/Actions/SettingsActions";

let  SidebarBase = props =>{

    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();



    useEffect(() => {
        return() =>{
            dispatch(setSetting([props.selector, null]));
        }
    },[dispatch]);




    let selected_item = {[props.selection_key]:""};
    let export_enabled = false;
    if(settings[props.selector]){
        export_enabled = true;
        selected_item = props.objects[settings[props.selector]];
    }

    let  handleRemove = (key) =>{
        let deleted = Object.values(props.objects).filter((obj)=>{
            return obj[props.display_key] === key;
        })[0];
        dispatch(setSetting([props.selector, null]));
        props.template.delete(deleted).then();
    };

    let handleExport = (args) =>{
        download_json(selected_item, selected_item.name);
    };

    let handleImport = (args) =>{
        upload_json().then((item)=>{
            let obj = new props.template(JSON.parse(item));
            obj.add_remote().then();
        }).catch((err)=>{
            alert(err);
        })
    };

    let handleAdd = (content) => {
        let id = get_next_id(Object.values(props.objects).map(a => a[props.selection_key]).sort());
        let obj = props.template.construct_empty(id);
        obj.add_remote().then();
    };

    let get_content = () =>{
        let types = [];
        let items = Object.values(props.objects).map((obj)=>{
            types.push("generic");
            return obj[props.display_key];
        })

        return [items, types]
    }

    const [names, types] = get_content();

    let handleSelect = (selection) =>{
        if(settings[props.selector] !==selection){
            let selected_item = Object.values(props.objects).filter((item)=>{
                return item[props.display_key] === selection;
            })[0];
            dispatch(setSetting([props.selector, selected_item[props.selection_key].toString()]));
        }
    };

    const ResponsiveGridLayout = WidthProvider(Responsive);

    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key={props.content_name+"_list"} data-grid={{x: 0, y: 0, w: 24, h: 3, static: true}} level="level_2">
                <SimpleContent name={props.content_name + " List"} content={
                    <div>
                        <SideToolbar
                            onAdd={handleAdd}
                            onImport={handleImport}
                            onExport={handleExport}
                            contentName={props.content_name}
                            exportEnabled={export_enabled}
                        />
                        <SelectableList
                            items={names}
                            types={types}
                            selected_item={selected_item[props.display_key]}
                            onRemove={handleRemove}
                            onSelect={handleSelect}
                        />
                    </div>
                }/>
            </UIPanel>
        </ResponsiveGridLayout>
    );

};

export default SidebarBase;
