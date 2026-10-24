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

import React, {useRef, useState} from "react";
import {SelectableListItem} from './SelectableListItem.js';
import type {ContextMenuAction} from './ContextMenu.js';
import {ConfirmDialog} from "./ConfirmDialog.js";
import {confirm_delete_enabled, set_confirm_delete} from "./confirm_preference.js";

interface SelectableListProps {
    multi_select?: boolean;
    selected_item?: string | string[] | undefined;
    onSelect?: ((name: string, multi?: boolean) => void);
    onRemove?: (name: string) => void;
    onActivate?: (name: string) => void;
    /// the items can be renamed, from their menu, when it is given
    onRename?: (name: string, new_name: string) => void;
    /// what is in the menu of an item, besides deleting it
    item_actions?: (name: string) => ContextMenuAction[];
    descriptions?: string[] | undefined;
    variant?: 'plain' | 'card';
    style?: React.CSSProperties;
    items: string[] | undefined;
    types?: any[]| undefined;
    /// The names selected, when there are many of them: with it the list is one where Shift selects a range and Ctrl or
    /// Cmd adds or takes away one, and the menu of the selected items is the one for all of them.
    selection?: string[] | undefined;
    /// the selection of many changed: it is the names that are selected now, the one name or none when it is not many
    onSelectionChange?: ((names: string[]) => void) | undefined;
    /// the selected items are deleted, when it is not done by calling onRemove for each one
    onRemoveMany?: ((names: string[]) => void | Promise<void>) | undefined;
    /// what is in the menu of the selected items besides deleting them, like exporting them
    bulk_actions?: ((names: string[]) => ContextMenuAction[]) | undefined;
}


export let  SelectableList = (props: SelectableListProps) =>{

    // what the range of a Shift click starts from: the last item that was clicked without it
    const anchor = useRef<string | null>(null);
    const [confirming_many, set_confirming_many] = useState<string[] | null>(null);

    const many = props.selection !== undefined && props.selection.length > 1 ? props.selection : null;

    let handle_select = (name: string, multi?: boolean) =>{
        anchor.current = name;
        props.onSelect?.(name, multi);
    };

    let handle_modified_select = (name: string, mode: "range" | "toggle") =>{
        if(!props.onSelectionChange || !props.items) return;
        const current = many ?? (typeof props.selected_item === "string" && props.selected_item !== "" ? [props.selected_item] : []);
        if(mode === "toggle"){
            anchor.current = name;
            const next = current.includes(name) ? current.filter((n) => n !== name) : [...current, name];
            props.onSelectionChange(next.length > 0 ? next : [name]);
            return;
        }
        const from = props.items.indexOf(anchor.current ?? current[0] ?? name);
        const to = props.items.indexOf(name);
        if(from < 0 || to < 0){
            props.onSelectionChange([name]);
            return;
        }
        props.onSelectionChange(props.items.slice(Math.min(from, to), Math.max(from, to) + 1));
    };

    let remove_many = async (names: string[]) =>{
        if(props.onRemoveMany){
            await props.onRemoveMany(names);
        } else {
            // one after the other, each one is removed with the names the others have left
            for(const name of names) await props.onRemove?.(name);
        }
        props.onSelectionChange?.([]);
    };

    const bulk_menu = (names: string[]): ContextMenuAction[] => [
        ...(props.bulk_actions?.(names) ?? []),
        ...(props.onRemove || props.onRemoveMany ? [{
            label: "Delete " + names.length + " items",
            danger: true,
            onSelect: () => confirm_delete_enabled() ? set_confirming_many(names) : remove_many(names)
        }] : [])
    ];

    // the menu of an item that is not in the selection is for that item alone: the selection is that item then
    let handle_menu_open = (name: string) =>{
        if(many !== null && !many.includes(name)) props.onSelectionChange?.([name]);
    };

    let constructListContent = (names: any, icons: any) =>{
        let ret = []
        for(let i = 0; i< names.length; i++){
            let selected;
            if(many !== null){
                selected = many.includes(names[i]);
            } else if(props.selected_item === undefined){
                selected = false;
            } else if(props.multi_select){
                selected = props.selected_item.includes(names[i]);
            } else{
                selected = props.selected_item===names[i];
            }
            ret.push(
                <SelectableListItem
                    multi_select={props.multi_select}
                    key={names[i]}
                    onRemove={props.onRemove}
                    onSelect={props.onSelectionChange ? handle_select : props.onSelect}
                    onActivate={props.onActivate}
                    actions={props.item_actions?.(names[i])}
                    onRename={props.onRename}
                    existing_names={names}
                    card={props.variant === 'card'}
                    description={props.descriptions?.[i]}
                    selected={selected}
                    icon={icons ? icons[i]: undefined}
                    {...(props.onSelectionChange ? {
                        onModifiedSelect: handle_modified_select,
                        onMenuOpen: handle_menu_open,
                        bulk_actions: many !== null && many.includes(names[i]) ? bulk_menu(many) : undefined
                    } : {})}
                    name={names[i]}/>
            )
        }
        return ret;
    }


    if(props.items){
        return(
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: props.variant === "card" ? "0.5em" : "0.25em",
                margin: "0.5em",
                minHeight:"0",
                width:"100%",
                overflowY:"auto",
                maxHeight:"13em",
                ...props.style
            }}>
                {constructListContent(props.items, props.types)}
                {confirming_many !== null && (
                    <ConfirmDialog
                        title={"Delete " + confirming_many.length + " items?"}
                        message="This cannot be undone."
                        confirm_label="Delete"
                        onCancel={() => set_confirming_many(null)}
                        onConfirm={(do_not_ask_again) => {
                            const names = confirming_many;
                            set_confirming_many(null);
                            if(do_not_ask_again) set_confirm_delete(false);
                            remove_many(names);
                        }}
                    />
                )}
            </div>
        );
    }
};

