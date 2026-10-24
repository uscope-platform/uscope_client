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

import React, {useEffect, useState} from "react";
import type {ReactNode} from "react";
import {MdClose} from "react-icons/md";
import {ColorTheme} from "./ColorTheme.js";
import {ConfirmDialog} from "./ConfirmDialog.js";
import {ContentDiv} from "./panels/UIPanel.js";
import {PanelTitle, TitleBar} from "./panels/TitleBar.js";

interface RememberedTabs {
    open_ids: number[];
    active_id: number | null;
    preview_id: number | null;
}

// the tabs of each editor, for the view to find them as it was left when the user comes back to it
const remembered_tabs = new Map<string, RememberedTabs>();

/// Which items of a store are open in tabs, the one that is shown, and the preview: the tab that the next item opened
/// takes the place of, as in VS Code, until it is kept. The tabs are remembered under `key` while the app is open, so
/// that leaving the view and coming back finds them again.
export const useEditorTabs = <T extends {id: number}>(key: string, items: Record<number, T>) => {
    const [open_ids, set_open_ids] = useState<number[]>(() => remembered_tabs.get(key)?.open_ids ?? []);
    const [active_id, set_active_id] = useState<number | null>(() => remembered_tabs.get(key)?.active_id ?? null);
    const [preview_id, set_preview_id] = useState<number | null>(() => remembered_tabs.get(key)?.preview_id ?? null);

    useEffect(() => {
        remembered_tabs.set(key, {open_ids, active_id, preview_id});
    }, [key, open_ids, active_id, preview_id]);

    // an item that is deleted loses its tab
    useEffect(() => {
        const remaining = open_ids.filter((id) => items[id] !== undefined);
        if(remaining.length !== open_ids.length){
            set_open_ids(remaining);
            if(preview_id !== null && items[preview_id] === undefined) set_preview_id(null);
            if(active_id !== null && items[active_id] === undefined) set_active_id(remaining[remaining.length - 1] ?? null);
        }
    }, [items]);

    const keep = (id: number) => {
        if(id === preview_id) set_preview_id(null);
    };

    /// a click on an item of the list: it is only looked at
    const select = (id: number) => {
        if(items[id] === undefined) return;
        if(!open_ids.includes(id)){
            const replaced = preview_id !== null && open_ids.includes(preview_id);
            set_open_ids(replaced ? open_ids.map((open_id) => open_id === preview_id ? id : open_id) : [...open_ids, id]);
            set_preview_id(id);
        }
        set_active_id(id);
    };

    /// a double click on an item of the list: it is opened to stay
    const activate = (id: number) => {
        if(items[id] === undefined) return;
        if(!open_ids.includes(id)) set_open_ids([...open_ids, id]);
        set_active_id(id);
        keep(id);
    };

    const close = (id: number) => {
        const index = open_ids.indexOf(id);
        const remaining = open_ids.filter((open_id) => open_id !== id);
        set_open_ids(remaining);
        keep(id);
        if(id === active_id) set_active_id(remaining[Math.min(index, remaining.length - 1)] ?? null);
    };

    const open_items = open_ids.flatMap((id) => items[id] !== undefined ? [items[id]!] : []);

    return {open_items, active_id, preview_id, set_active_id, select, activate, keep, close};
};

interface EditorTabsProps<T extends {id: number, name: string}> {
    /// what is called by the tab bar when no item is open
    title: string;
    items: T[];
    active_id: number | null;
    /// the tab that is replaced by the next item that is opened, shown in italics
    preview_id: number | null;
    on_select: (id: number) => void;
    /// the tab is kept instead of replaced
    on_keep: (id: number) => void;
    on_close: (id: number) => void;
    empty_message: string;
    /// at the end of the tab bar, like the button that goes back to where the user came from
    actions?: ReactNode;
    /// the editor of an item, that tells when it has changes that are not saved
    render_editor: (item: T, on_dirty_change: (dirty: boolean) => void) => ReactNode;
}

/// The editors of the open items, one tab each with the x that closes it. All the editors stay mounted, so that what is
/// not saved is still there when the tab is back; the tabs of the unsaved ones have an asterisk.
export const EditorTabs = <T extends {id: number, name: string}>(props: EditorTabsProps<T>) => {
    const [dirty_ids, set_dirty_ids] = useState<Record<number, boolean>>({});
    const [closing, set_closing] = useState<T | null>(null);

    const set_dirty = (id: number, dirty: boolean) => {
        set_dirty_ids((current) => current[id] === dirty ? current : {...current, [id]: dirty});
        // what was edited is not a preview anymore
        if(dirty) props.on_keep(id);
    };

    const request_close = (item: T) => {
        if(dirty_ids[item.id]) set_closing(item);
        else props.on_close(item.id);
    };

    return(
        <div style={{display: "flex", flexDirection: "column", flex: 1, minHeight: 0}}>
            <TitleBar name={props.title}>
                {props.items.length === 0 && <PanelTitle selected>{props.title}</PanelTitle>}
                {props.items.map((item) => (
                    <PanelTitle
                        key={item.id}
                        selected={item.id === props.active_id}
                        onClick={() => props.on_select(item.id)}
                        onDoubleClick={(event) => {event.stopPropagation(); props.on_keep(item.id);}}
                        style={item.id === props.preview_id ? {fontStyle: "italic"} : undefined}
                    >
                        {item.name}{dirty_ids[item.id] ? " *" : ""}
                        <MdClose
                            aria-label={"Close " + item.name}
                            size="1.1em"
                            color={ColorTheme.icons_color}
                            style={{marginLeft: "0.5em", borderRadius: 3}}
                            onClick={(event) => {event.stopPropagation(); request_close(item);}}
                        />
                    </PanelTitle>
                ))}
                {props.actions && <div style={{marginLeft: "auto", display: "flex", alignItems: "center"}}>{props.actions}</div>}
            </TitleBar>
            <ContentDiv>
                {props.items.length === 0 && (
                    <div style={{padding: "1em", opacity: 0.6}}>{props.empty_message}</div>
                )}
                {props.items.map((item) => (
                    <div key={item.id} style={{display: item.id === props.active_id ? "block" : "none"}}>
                        {props.render_editor(item, (dirty) => set_dirty(item.id, dirty))}
                    </div>
                ))}
            </ContentDiv>
            {closing && (
                <ConfirmDialog
                    title={"Close " + closing.name + "?"}
                    message="Its changes are not saved."
                    confirm_label="Close"
                    allow_skip={false}
                    onCancel={() => set_closing(null)}
                    onConfirm={() => {
                        props.on_close(closing.id);
                        set_closing(null);
                    }}
                />
            )}
        </div>
    );
};
