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

import React, {type ReactNode, useState} from 'react';
import {MdAdd} from "react-icons/md";
import {styled} from "goober";

import {ColorTheme} from "./ColorTheme.js";
import {InputField} from "./InputField.js";
import {SelectableList} from "./SelectableList.js";

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
    onAdd: () => void;
    onRemove: (item: T) => void | Promise<void>;
    // the editor of the selected item
    children: (item: T) => ReactNode;
}

/// Edits a collection of items: a searchable list, and the editor of the selected item next to it. Dozens of items
/// made a stack of cards unusable
export let ItemsEditor = <T,>(props: ItemsEditorProps<T>) =>{

    // the item itself, not its name: the items are edited in place, so it stays the selected one when it is renamed
    const [selected_item, set_selected_item] = useState<T | null>(null);
    const [filter, set_filter] = useState("");

    const description = (item: T) => props.description ? props.description(item) : "";

    const needle = filter.trim().toLowerCase();
    const visible = props.items.filter((item) => needle === "" || (props.name(item) + " " + description(item)).toLowerCase().includes(needle));

    // the one selected, or the first one when it is gone (removed, or the application changed)
    const selected = selected_item !== null && props.items.includes(selected_item) ? selected_item : visible[0];

    let handleRemove = async (name: string) =>{
        const item = props.items.find(i => props.name(i) === name);
        if(item !== undefined) await props.onRemove(item);
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
                selected_item={selected === undefined ? undefined : props.name(selected)}
                onSelect={(name) => set_selected_item(visible.find(item => props.name(item) === name) ?? null)}
                onRemove={handleRemove}
                style={{maxHeight: "calc(100vh - 16rem)", margin: 0, width: "auto"}}
            />
            {selected !== undefined
                // keyed by position, so that the editor starts afresh for another item but not when this one is renamed
                ? <React.Fragment key={props.items.indexOf(selected)}>{props.children(selected)}</React.Fragment>
                : <div/>
            }
        </Layout>
    );
};
