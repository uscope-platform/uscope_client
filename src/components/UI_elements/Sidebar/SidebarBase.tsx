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

import {AddCard, SelectableList} from "../index.jsx";
import type {ContextMenuAction} from "../ContextMenu.js";

import 'react-tooltip/dist/react-tooltip.css'
import {download_json, get_next_id, upload_json} from "#client_core/index.js";

interface SidebarBaseProps {
    content_name: string;
    display_key: string;
    selection_key: string;
    type_prop?: string;
    initial_value?: any;
    objects: any;
    template: any;
    items_filter?: string[];
    onSelect?: (id: number) => void;
    /// the item that is already selected is clicked again
    onReselect?: (id: number) => void;
    /// an item is double clicked
    onActivate?: (id: number) => void;
    onAdd?: (item: {id: any, object:any}) => void;
    onDelete?: (item: any) => void;
    onImport?: (item: string) => void;
    omImportDone?: (item: any) => void;
    // the content of the exported file, when it is not the item itself
    export_format?: (item: any) => unknown;
    /// the field shown under the name of each item, in gray
    description_key?: string;
    /// what is in the menu of an item besides the actions of the list, with the item the menu was opened on
    extra_item_actions?: (item: any) => ContextMenuAction[];
}

/// The list of the items of one kind with its toolbar, to be the content of a sidebar panel
export let SidebarBase = (props: SidebarBaseProps) =>{

    // the item selected to begin with, when there is one and it is in the list
    const [selected, set_selected] = useState<string | null>(() => {
        const id = props.initial_value?.[props.selection_key];
        return id !== undefined && props.objects[id] !== undefined ? String(id) : null;
    });

    let selected_item: any = {[props.display_key]:""};
    if(selected){
        selected_item = props.objects[selected];
    }

    let item_named = (name: string): any =>{
        return Object.values(props.objects).find((obj: any) => obj[props.display_key] === name);
    };

    let handleAdd = () => {
        let id = get_next_id(Object.values(props.objects).map((a: any) => a[props.selection_key]));
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

    let handleRename = async (name: string, new_name: string) =>{
        const item = item_named(name);
        if(item === undefined) return;
        // what edits the name depends on the kind of the item
        const instance = new props.template(item);
        if(instance.edit_name){
            await instance.edit_name(new_name);
        } else if(instance.edit_field){
            await instance.edit_field(props.display_key, new_name);
        } else if(instance.edit_misc_param){
            await instance.edit_misc_param(props.display_key, new_name, false);
        }
    };

    let handleExport = (item: any) =>{
        const content = props.export_format ? props.export_format(item) : item;
        download_json(content, item[props.display_key]);
    };

    let handleImport = () =>{
        upload_json().then((item: { name: string; data: string })=>{
            if(props.onImport){
                props.onImport(item.data);
            } else {
                let ids = Object.values(props.objects).map((a: any) => a[props.selection_key]);
                let obj = new props.template(JSON.parse(item.data));
                if(ids.includes(obj[props.selection_key])){
                    if(JSON.stringify(props.objects[obj[props.selection_key]]) === JSON.stringify(obj.get_raw_obj())){
                        return;
                    } else {
                        obj.id = get_next_id(Object.values(props.objects).map((a: any) => a[props.selection_key]));
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

    const describe = (obj: any): string => {
        const value = props.description_key ? obj[props.description_key] : undefined;
        return value === undefined || value === null ? "" : String(value);
    };

    let get_content = () =>{
        let types: any[] = [];
        let descriptions: string[] = [];
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
                descriptions.push(describe(props.objects[scr_id]));
                return props.objects[scr_id][props.display_key];
            })
        } else{
            items = Object.values(props.objects).map((obj: any)=>{
                let type_prop = props.type_prop
                if(type_prop && obj[type_prop]){
                    types.push(obj[type_prop]);
                } else {
                    types.push("generic");
                }
                descriptions.push(describe(obj));
                return obj[props.display_key];
            })
        }

        return [items, types, descriptions]
    }

    const [names, types, descriptions] = get_content();

    let handleActivate = (name: string) =>{
        const item = item_named(name);
        if(item !== undefined && props.onActivate) props.onActivate(item[props.selection_key]);
    };

    let handleSelect = (selection: string) =>{
        if(selected !== null && props.objects[selected]?.[props.display_key] === selection){
            const item = item_named(selection);
            if(item !== undefined && props.onReselect) props.onReselect(item[props.selection_key]);
        }
        if(selected !==selection){
            let sel_item: any = Object.values(props.objects).filter((item: any)=>{
                return item[props.display_key] === selection;
            })[0];
            set_selected(sel_item[props.selection_key].toString());
            if(props.onSelect) props.onSelect(sel_item[props.selection_key]);
        }
    };

    let handleCopy = async (item: any) =>{
        let id = get_next_id(Object.values(props.objects).map((a: any) => a[props.selection_key]));
        let copy_obj = await props.template.duplicate(item, id);
        await copy_obj.add_remote();
        if(props.onAdd){
            props.onAdd({id:id, object:copy_obj});
        }
    }

    const import_action: ContextMenuAction = {label: "Import", onSelect: handleImport};

    // what is done to an item is done to the one the menu was opened on, not to the selected one
    let item_actions = (name: string): ContextMenuAction[] =>{
        const item = item_named(name);
        return [
            {label: "Duplicate", onSelect: () => handleCopy(item)},
            {label: "Export", onSelect: () => handleExport(item)},
            ...(props.extra_item_actions?.(item) ?? []),
            import_action
        ];
    };

    return(
        <div style={{height:'20em', display:'flex', flexDirection:'column'}}>
            <AddCard label={"Add " + props.content_name} onClick={handleAdd} actions={[import_action]}/>
            <SelectableList
                items={names}
                types={types}
                descriptions={props.description_key ? descriptions : undefined}
                selected_item={selected_item[props.display_key]}
                onRemove={handleRemove}
                onSelect={handleSelect}
                onActivate={handleActivate}
                onRename={handleRename}
                item_actions={item_actions}
                // fills what the add card leaves and scrolls, instead of stopping short of the panel
                style={{flex: 1, maxHeight: "none", width: "auto"}}
            />
        </div>
    );

};
