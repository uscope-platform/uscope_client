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

import React, {useState} from "react";
import {MdClose} from "react-icons/md";
import {ColorTheme, ConfirmDialog, ContentDiv, PanelTitle, TitleBar} from "#UI/index.js";
import ScriptsEditor from "./ScriptsEditor.js";
import type {script} from "#interfaces/index.js";

interface ScriptTabsProps {
    /// the scripts that have a tab, in the order of the tabs
    scripts: script[];
    active_id: number | null;
    /// the tab that is replaced by the next script that is opened, shown in italics
    preview_id: number | null;
    on_select: (id: number) => void;
    /// the tab is kept instead of replaced
    on_keep: (id: number) => void;
    on_close: (id: number) => void;
}

/// The editors of the open scripts, one tab each with the x that closes it. All the editors stay mounted, so that what
/// is not saved is still there when the tab is back.
let ScriptTabs = (props: ScriptTabsProps) =>{
    const [dirty_ids, set_dirty_ids] = useState<Record<number, boolean>>({});
    const [closing, set_closing] = useState<script | null>(null);

    let set_dirty = (id: number, dirty: boolean) =>{
        set_dirty_ids((current) => current[id] === dirty ? current : {...current, [id]: dirty});
        // what was edited is not a preview anymore
        if(dirty) props.on_keep(id);
    };

    let request_close = (item: script) =>{
        if(dirty_ids[item.id]) set_closing(item);
        else props.on_close(item.id);
    };

    return(
        <div style={{display: "flex", flexDirection: "column", flex: 1, minHeight: 0}}>
            <TitleBar name="Script Source Code">
                {props.scripts.length === 0 && <PanelTitle selected>Script Source Code</PanelTitle>}
                {props.scripts.map((item) => (
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
            </TitleBar>
            <ContentDiv>
                {props.scripts.length === 0 && (
                    <div style={{padding: "1em", opacity: 0.6}}>Select a script from the list to edit it.</div>
                )}
                {props.scripts.map((item) => (
                    <div key={item.id} style={{display: item.id === props.active_id ? "block" : "none"}}>
                        <ScriptsEditor script={item} on_dirty_change={(dirty) => set_dirty(item.id, dirty)}/>
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

export default ScriptTabs;
