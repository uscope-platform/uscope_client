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

import React from "react";
import {SelectableListItem} from './SelectableListItem.js';
import type {ContextMenuAction} from './ContextMenu.js';

interface SelectableListProps {
    multi_select?: boolean;
    selected_item?: string | string[] | undefined;
    onSelect?: ((name: string, multi?: boolean) => void);
    onRemove?: (name: string) => void;
    onActivate?: (name: string) => void;
    /// what is in the menu of an item, besides deleting it
    item_actions?: (name: string) => ContextMenuAction[];
    descriptions?: string[];
    variant?: 'plain' | 'card';
    style?: React.CSSProperties;
    items: string[] | undefined;
    types?: any[]| undefined;
}


export let  SelectableList = (props: SelectableListProps) =>{

    let constructListContent = (names: any, icons: any) =>{
        let ret = []
        for(let i = 0; i< names.length; i++){
            let selected;
            if(props.selected_item === undefined){
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
                    onSelect={props.onSelect}
                    onActivate={props.onActivate}
                    actions={props.item_actions?.(names[i])}
                    card={props.variant === 'card'}
                    description={props.descriptions?.[i]}
                    selected={selected}
                    icon={icons ? icons[i]: undefined}
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
            </div>
        );
    }
};

