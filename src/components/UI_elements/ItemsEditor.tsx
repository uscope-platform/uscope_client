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

import React, {type ReactNode, useRef, useState} from 'react';
import {MdAdd} from "react-icons/md";
import {styled} from "goober";

import {ColorTheme} from "./ColorTheme.js";
import {InputField} from "./InputField.js";
import {SelectableList} from "./SelectableList.js";
import type {ContextMenuAction} from "./ContextMenu.js";

// two rows, so that the editor starts level with the first card of the list and not with its header
const Layout = styled('div')`
  display: grid;
  grid-template-columns: 16rem minmax(0, 1fr);
  grid-template-rows: auto auto;
  gap: 0.5rem 1rem;
  align-items: start;
`

const ListHeader = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
`

const SearchRow = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Count = styled('div')`
  font-size: 0.8rem;
  color: ${ColorTheme.inactive_icons_color};
`

interface ItemsEditorProps<T> {
    items: T[];
    // what the items are, in the plural ("channels")
    noun: string;
    // the name identifies the item in the list
    name: (item: T) => string;
    // the line under the name, which is also searched
    description?: (item: T) => string;
    // shown before the name
    icon?: (item: T) => ReactNode;
    onAdd: () => void;
    onRemove: (item: T) => void | Promise<void>;
    // when given, the items are renamed from their menu
    onRename?: (item: T, new_name: string) => void | Promise<void>;
    // the items selected with Shift or Ctrl are deleted together, when it is not done by removing one after the other
    onRemoveMany?: (items: T[]) => void | Promise<void>;
    // what is in the menu of the items selected with Shift or Ctrl besides deleting them, like exporting them
    bulk_actions?: (items: T[]) => ContextMenuAction[];
    // the editor of the selected item
    children: (item: T) => ReactNode;
}

/// Edits a collection of items: a searchable list, and the editor of the selected item next to it. Dozens of items
/// made a stack of cards unusable
export let ItemsEditor = <T,>(props: ItemsEditorProps<T>) =>{

    // the item itself, not its name: the items are edited in place, so it stays the selected one when it is renamed
    const [selected_item, set_selected_item] = useState<T | null>(null);
    const [filter, set_filter] = useState("");
    // the names of the items when many are selected, with Shift or with Ctrl: then no one of them is edited
    const [multi, set_multi] = useState<string[]>([]);

    const description = (item: T) => props.description ? props.description(item) : "";

    const needle = filter.trim().toLowerCase();
    const visible = props.items.filter((item) => needle === "" || (props.name(item) + " " + description(item)).toLowerCase().includes(needle));

    // the one selected. When the item itself is gone, because the items were built again from the store after an edit,
    // the one with the same name is, or the one in the same place (it was renamed elsewhere), and the first one when
    // there is none (removed, or another application)
    const last_index = useRef(0);
    const last_name = useRef<string | null>(null);
    const selected = selected_item !== null && props.items.includes(selected_item)
        ? selected_item
        : selected_item !== null
            ? props.items.find(i => props.name(i) === last_name.current) ?? props.items[last_index.current] ?? visible[0]
            : visible[0];
    last_index.current = selected !== undefined ? props.items.indexOf(selected) : 0;
    last_name.current = selected !== undefined ? props.name(selected) : null;

    const visible_names = visible.map(props.name);
    const many = multi.filter((name) => visible_names.includes(name));
    const selection = many.length > 1 ? many : null;
    const items_named = (names: string[]) => names.flatMap((name) => props.items.filter((item) => props.name(item) === name));

    let handleSelectionChange = (names: string[]) =>{
        if(names.length > 1){
            set_multi(names);
            return;
        }
        set_multi([]);
        const item = visible.find((i) => props.name(i) === names[0]);
        if(item !== undefined) set_selected_item(item);
    }

    let handleRemove = async (name: string) =>{
        const item = props.items.find(i => props.name(i) === name);
        if(item !== undefined) await props.onRemove(item);
    }

    let handleRename = async (name: string, new_name: string) =>{
        const item = props.items.find(i => props.name(i) === name);
        // the selection follows the item to its new name
        if(item !== undefined && props.name(item) === last_name.current) last_name.current = new_name;
        if(item !== undefined && props.onRename) await props.onRename(item, new_name);
    }

    return(
        <Layout>
            <ListHeader>
                <SearchRow>
                    <MdAdd onClick={props.onAdd} size={ColorTheme.icons_size} color={ColorTheme.icons_color}/>
                    <div style={{flexGrow: 1}}>
                        <InputField compact name="items_filter" label="Search" onChange={(e) => set_filter(e.target.value)}/>
                    </div>
                </SearchRow>
                <Count>{visible.length === props.items.length ? props.items.length + " " + props.noun : visible.length + " of " + props.items.length}</Count>
            </ListHeader>
            <div/>
            <SelectableList
                variant="card"
                items={visible.map(props.name)}
                {...(props.description ? {descriptions: visible.map(description)} : {})}
                {...(props.icon ? {types: visible.map(props.icon)} : {})}
                selected_item={selected === undefined ? undefined : props.name(selected)}
                {...(selection ? {selection} : {})}
                onSelectionChange={handleSelectionChange}
                {...(props.onRemoveMany ? {onRemoveMany: (names: string[]) => props.onRemoveMany?.(items_named(names))} : {})}
                {...(props.bulk_actions ? {bulk_actions: (names: string[]) => props.bulk_actions?.(items_named(names)) ?? []} : {})}
                onSelect={(name) => {
                    set_multi([]);
                    set_selected_item(visible.find(item => props.name(item) === name) ?? null);
                }}
                onRemove={handleRemove}
                {...(props.onRename ? {onRename: handleRename} : {})}
                style={{maxHeight: "calc(100vh - 16rem)", margin: 0, width: "auto"}}
            />
            {selection
                ? <div style={{padding: "1em", textAlign: "center", fontStyle: "italic", opacity: 0.6}}>
                    {selection.length} {props.noun} selected. Right click one of them for what can be done to all of them.
                </div>
                : selected !== undefined
                    // keyed by position, so that the editor starts afresh for another item but not when this one is renamed
                    ? <React.Fragment key={props.items.indexOf(selected)}>{props.children(selected)}</React.Fragment>
                    : <div/>
            }
        </Layout>
    );
};
