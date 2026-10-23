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

import {styled} from 'goober';
import React, {useRef, useState, type ReactNode} from "react";
import {Image} from "./Image.js";
import {ColorTheme} from "./ColorTheme.js";
import {useContextMenu, type ContextMenuAction} from "./ContextMenu.js";
import {ConfirmDialog} from "./ConfirmDialog.js";
import {confirm_delete_enabled, set_confirm_delete} from "./confirm_preference.js";

interface ItemLayoutProps {
    selected: boolean;
    variant: 'card' | 'plain';
}


const ItemLayout = styled<'div', ItemLayoutProps>('div')(({ selected, variant }) => variant === 'card' ? `
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.25em 0.75em;
  border-radius: 0.5rem;
  border: 1px solid ${selected ? ColorTheme.background.accents : ColorTheme.background.borders};
  border-left-width: 4px;
  background: ${selected ? ColorTheme.background.level_4 : ColorTheme.background.level_3};
  transition: background 0.15s, border-color 0.15s;
  &:hover, &[data-menu-open] {
    background: ${ColorTheme.background.level_4};
  }
` : `
  display: flex;
  align-items: center;
  gap: 0.5em;
  border-radius: 4px;
  /* the selected item has the accent around it, and the one under the pointer a background of its own, so that they are told apart */
  box-shadow: inset 0 0 0 1px ${selected ? ColorTheme.background.accents : '#0000'};
  background: #0000;
  transition: background 0.15s;
  &:hover, &[data-menu-open] {
    background: ${ColorTheme.background.select_background};
  }
`);

interface SelectableListItemProps {
    icon:string| ReactNode;
    selected: boolean;
    multi_select?: boolean | undefined;
    name: string;
    onRemove?: ((name: string) => void )| undefined;
    onSelect?: ((name: string, multi?: boolean) => void )| undefined;
    onMouseEnter?: (name: string) => void;
    onActivate?: ((name: string) => void) | undefined;
    /// the item can be renamed, from its menu, when it is given
    onRename?: ((name: string, new_name: string) => void) | undefined;
    /// the names of the items of the list, that the new name cannot be
    existing_names?: string[] | undefined;
    /// what is in the menu of the item, besides deleting it
    actions?: ContextMenuAction[] | undefined;
    description?: string | undefined;
    card?: boolean | undefined;
    iconSize?: number | string;
}

export let  SelectableListItem = (props: SelectableListItemProps) =>{
    const image_src = "assets/selector_icons/" + props.icon+".svg";
    const alt = props.icon + "language icon";


    let handle_click = (event: any) =>{
        if(props.multi_select && props.onSelect){
            if(event.ctrlKey) props.onSelect(props.name, true);
            else props.onSelect(props.name, false);
        } else{
            if(props.onSelect) props.onSelect(props.name)
        }

    };



    let get_icon_image = (icon: string | ReactNode) =>{
        if(props.icon){
            if(typeof icon === "string"){
                return <Image style={{width:"2em"}} src={image_src} alt={alt}/>
            } else {
                return icon;
            }
        }
    }

    const [confirming_delete, set_confirming_delete] = useState(false);

    const [renaming, set_renaming] = useState(false);
    const [draft, set_draft] = useState(props.name);
    const rename_done = useRef(false);

    const draft_is_valid = draft.trim() !== "" && (draft === props.name || !(props.existing_names ?? []).includes(draft));

    let finish_rename = (apply: boolean) =>{
        if(rename_done.current) return;
        if(apply && draft_is_valid){
            rename_done.current = true;
            set_renaming(false);
            if(draft !== props.name) props.onRename?.(props.name, draft);
        } else if(!apply){
            rename_done.current = true;
            set_renaming(false);
        }
    };

    const actions: ContextMenuAction[] = [...(props.actions ?? [])];
    if(props.onRename){
        actions.push({label: "Rename", onSelect: () => {
            rename_done.current = false;
            set_draft(props.name);
            set_renaming(true);
        }});
    }
    if(props.onRemove){
        const remove = props.onRemove;
        actions.push({
            label: "Delete",
            danger: true,
            onSelect: () => confirm_delete_enabled() ? set_confirming_delete(true) : remove(props.name)
        });
    }
    const context_menu = useContextMenu(actions);

    let handle_double_click = () =>{
        if(props.onActivate) props.onActivate(props.name);
    }

    let handleMouseEnter = () =>{
        if(props.onMouseEnter)
            props.onMouseEnter(props.name);
    }

    return(
        <ItemLayout selected={props.selected} variant={props.card ? "card" : "plain"} onContextMenu={context_menu.on_context_menu} data-menu-open={context_menu.open || confirming_delete ? "" : undefined}>
            <div></div>
            <div onMouseEnter={handleMouseEnter} onClick={handle_click} onDoubleClick={handle_double_click} style={{display:"flex", flexGrow:1}}>
                {get_icon_image(props.icon)}
                <div style={{marginLeft:"0.5em", cursor:"default"}}>
                    {renaming ? (
                        <input
                            autoFocus
                            value={draft}
                            onFocus={(event) => event.currentTarget.select()}
                            onChange={(event) => set_draft(event.target.value)}
                            onClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) => {
                                if(event.key === "Enter") finish_rename(true);
                                if(event.key === "Escape") finish_rename(false);
                            }}
                            // leaving the field applies the name when it is a valid one and drops it when it is not
                            onBlur={() => finish_rename(draft_is_valid)}
                            style={{marginTop: "3px", width: "100%", font: "inherit", outline: draft_is_valid ? undefined : "1px solid " + ColorTheme.field.error}}
                        />
                    ) : (
                        <p style={{paddingTop:"6px"}}>{props.name}</p>
                    )}
                    {props.description && <p style={{fontSize:"0.8em", opacity:0.6, paddingBottom:"6px"}}>{props.description}</p>}
                </div>
            </div>
            {context_menu.button}
            {context_menu.menu}
            {confirming_delete && props.onRemove && (
                <ConfirmDialog
                    title={"Delete " + props.name + "?"}
                    message="This cannot be undone."
                    confirm_label="Delete"
                    onCancel={() => set_confirming_delete(false)}
                    onConfirm={(do_not_ask_again) => {
                        set_confirming_delete(false);
                        if(do_not_ask_again) set_confirm_delete(false);
                        props.onRemove?.(props.name);
                    }}
                />
            )}
        </ItemLayout>
    );
};

