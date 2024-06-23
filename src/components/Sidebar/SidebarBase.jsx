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

import {SelectableList, SimpleContent, UIPanel} from "../UI_elements";

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

    let selected_item = props.initial_value ? {[props.display_key]:props.initial_value.value}: {[props.display_key]:""};
    let export_enabled = false;
    if(settings[props.selector]  ){
        export_enabled = true;
        selected_item = props.objects[settings[props.selector]];
    }

    let handleAdd = (content) => {
        let id = get_next_id(Object.values(props.objects).map(a => a[props.selection_key]).sort());
        let obj = props.template.construct_empty(id);
        obj.add_remote().then((args)=>{
            if(props.onAdd){
                props.onAdd(id);
            }
        });
    };

    let  handleRemove = (key) =>{
        let deleted = Object.values(props.objects).filter((obj)=>{
            return obj[props.display_key] === key;
        })[0];
        dispatch(setSetting([props.selector, null]));
        props.template.delete(deleted).then((args) =>{
            if(props.onDelete){
                props.onDelete(deleted);
            }
        });
    };

    let handleExport = (args) =>{
        if(props.export_array){
            download_json([selected_item], selected_item[props.display_key]);
        } else {
            download_json(selected_item, selected_item[props.display_key]);
        }

    };

    let handleImport = (args) =>{
        upload_json().then((item)=>{
            if(props.onImport){
                props.onImport(item.data);
            } else {
                let ids = Object.values(props.objects).map(a => a[props.selection_key]);
                let obj = new props.template(JSON.parse(item.data));
                if(ids.includes(obj[props.selection_key])){
                    if(JSON.stringify(props.objects[obj[props.selection_key]]) === JSON.stringify(obj.get_raw_obj())){
                        return;
                    } else {
                        obj.id = get_next_id(Object.values(props.objects).map(a => a[props.selection_key]).sort());
                        let labels = Object.values(props.objects).map(a => a[props.display_key]);
                        if(labels.includes(obj[props.display_key])){
                            obj[props.display_key] = obj[props.display_key] + "_" + obj.id.toString();
                        }
                    }
                }
                obj.add_remote().then(()=>{
                    if(props.omImportDone){
                        props.omImportDone(obj);
                    }
                });
            }
        }).catch((err)=>{
            alert(err);
        })
    };

    let get_content = () =>{
        let types = [];
        let items;

        if(props.items_filter){
            items = Object.keys(props.objects).filter((scr_id)=>{
                return props.items_filter.includes(scr_id);
            }).map((scr_id)=>{
                if(props.objects[scr_id][props.type_prop]){
                    types.push(props.objects[scr_id][props.type_prop]);
                } else {
                    types.push("generic");
                }
                return props.objects[scr_id][props.display_key];
            })
        } else{
            items = Object.values(props.objects).map((obj)=>{
                types.push("generic");
                if(props.display_key[props.type_prop]){
                    types.push(props.objects[props.type_prop][props.type_prop]);
                } else {
                    types.push("generic");
                }
                return obj[props.display_key];
            })
        }

        return [items, types]
    }

    const [names, types] = get_content();

    let handleSelect = (selection) =>{
        if(settings[props.selector] !==selection){
            let sel_item = Object.values(props.objects).filter((item)=>{
                return item[props.display_key] === selection;
            })[0];
            dispatch(setSetting([props.selector, sel_item[props.selection_key].toString()]));
            if(props.onSelect) props.onSelect(selection);
        }
    };

    return(
        <UIPanel key={props.content_name+"_list"} level="level_2">
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
    );

};

export default SidebarBase;
