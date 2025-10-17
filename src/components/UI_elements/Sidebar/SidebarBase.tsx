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

import React, {useState} from 'react';

import {SelectableList, SimpleContent, UIPanel} from "../index.jsx";

import 'react-tooltip/dist/react-tooltip.css'
import {SideToolbar} from "./SideToolbar.jsx";
import {download_json, get_next_id, upload_json} from "#client_core/index.js";

interface SidebarBaseProps {
    content_name: string;
    display_key: string;
    selection_key: string;
    type_prop?: string;
    initial_value: any;
    objects: any;
    template: any;
    items_filter?: string[];
    onSelect?: (id: number) => void;
    onAdd?: (item: any) => void;
    onDelete?: (item: any) => void;
    onImport?: (item: any) => void;
    omImportDone?: (item: any) => void;
    export_array?: boolean;
}

export let SidebarBase = (props: SidebarBaseProps) =>{

    const [selected, set_selected] = useState(null);

    let selected_item = props.initial_value ? {[props.display_key]:props.initial_value.value}: {[props.display_key]:""};
    let export_enabled = false;
    if(selected){
        export_enabled = true;
        selected_item = props.objects[selected];
    }

    let handleAdd = () => {
        let id = get_next_id(Object.values(props.objects).map((a: any) => a[props.selection_key]).sort());
        let obj = props.template.construct_empty(id);
        obj.add_remote().then(()=>{
            if(props.onAdd){
                props.onAdd({id:id, object:obj});
            }
        });
    };

    let  handleRemove = (key: string) =>{
        let deleted = Object.values(props.objects).filter((obj: any)=>{
            return obj[props.display_key] === key;
        })[0];
        set_selected(null);
        props.template.delete(deleted).then(() =>{
            if(props.onDelete){
                props.onDelete(deleted);
            }
        });
    };

    let handleExport = () =>{
        if(props.export_array){
            download_json([selected_item], selected_item[props.display_key]);
        } else {
            download_json(selected_item, selected_item[props.display_key]);
        }

    };

    let handleImport = () =>{
        upload_json().then((item: any)=>{
            if(props.onImport){
                props.onImport(item.data);
            } else {
                let ids = Object.values(props.objects).map((a: any) => a[props.selection_key]);
                let obj = new props.template(JSON.parse(item.data));
                if(ids.includes(obj[props.selection_key])){
                    if(JSON.stringify(props.objects[obj[props.selection_key]]) === JSON.stringify(obj.get_raw_obj())){
                        return;
                    } else {
                        obj.id = get_next_id(Object.values(props.objects).map((a: any) => a[props.selection_key]).sort());
                        let labels = Object.values(props.objects).map((a: any) => a[props.display_key]);
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
        let types: any[] = [];
        let items;
        let filter = props.items_filter;
        if(filter){
            items = Object.keys(props.objects).filter((scr_id)=>{
                return filter.includes(scr_id);
            }).map((scr_id)=>{
                let type_prop = props.type_prop
                if(type_prop && props.objects[scr_id][type_prop]){
                    types.push(props.objects[scr_id][type_prop]);
                } else {
                    types.push("generic");
                }
                return props.objects[scr_id][props.display_key];
            })
        } else{
            items = Object.values(props.objects).map((obj: any)=>{
                types.push("generic");
                let type_prop = props.type_prop
                if(type_prop && props.objects[type_prop]){
                    types.push(props.objects[type_prop][type_prop]);
                } else {
                    types.push("generic");
                }
                return obj[props.display_key];
            })
        }

        return [items, types]
    }

    const [names, types] = get_content();

    let handleSelect = (selection: string) =>{
        if(selected !==selection){
            let sel_item: any = Object.values(props.objects).filter((item: any)=>{
                return item[props.display_key] === selection;
            })[0];
            set_selected(sel_item[props.selection_key].toString());
            if(props.onSelect) props.onSelect(sel_item[props.selection_key]);
        }
    };

    let handleCopy = async () =>{
        let id = get_next_id(Object.values(props.objects).map((a: any) => a[props.selection_key]).sort());
        let copy_obj = await props.template.duplicate(selected_item, id);
        await copy_obj.add_remote();
        if(props.onAdd){
            props.onAdd({id:id, object:copy_obj});
        }
    }

    return(
        <UIPanel key={props.content_name+"_list"} level="level_2">
            <SimpleContent name={props.content_name + " List"}>
                <div
                    style={{height:'20em'}}>
                    <SideToolbar
                        onAdd={handleAdd}
                        onCopy={handleCopy}
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
            </SimpleContent>
        </UIPanel>
    );

};
