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

import React, {useEffect, useState} from 'react';

import {MainPane, PaneGroup, UIPanel} from "#UI/index.js";
import ScriptTabs from "./ScriptTabs.js";
import ScriptSidebar from "./ScriptSidebar.js";
import {useAppSelector} from "#redux/hooks.js";

interface ScriptManagerProps {}

let ScriptManager = (props: ScriptManagerProps) =>{

    const [open_ids, set_open_ids] = useState<number[]>([]);
    const [active_id, set_active_id] = useState<number | null>(null);
    // the tab that the next script opened takes the place of, like the preview of VS Code, until it is kept
    const [preview_id, set_preview_id] = useState<number | null>(null);

    const scripts =  useAppSelector(state => state.scripts);

    // a script that is deleted loses its tab
    useEffect(() => {
        const remaining = open_ids.filter((id) => scripts[id] !== undefined);
        if(remaining.length !== open_ids.length){
            set_open_ids(remaining);
            if(preview_id !== null && scripts[preview_id] === undefined) set_preview_id(null);
            if(active_id !== null && scripts[active_id] === undefined) set_active_id(remaining[remaining.length - 1] ?? null);
        }
    }, [scripts]);

    let handle_select = (selection: number) =>{
        if(scripts[selection] === undefined) return;
        if(!open_ids.includes(selection)){
            // a script that is only looked at takes the place of the one that was only looked at before
            const replaced = preview_id !== null && open_ids.includes(preview_id);
            set_open_ids(replaced ? open_ids.map((id) => id === preview_id ? selection : id) : [...open_ids, selection]);
            set_preview_id(selection);
        }
        set_active_id(selection);
    }

    let handle_keep = (id: number) =>{
        if(id === preview_id) set_preview_id(null);
    }

    // a double click opens the script to stay
    let handle_activate = (selection: number) =>{
        if(scripts[selection] === undefined) return;
        if(!open_ids.includes(selection)) set_open_ids([...open_ids, selection]);
        set_active_id(selection);
        handle_keep(selection);
    }

    let handle_close = (id: number) =>{
        const index = open_ids.indexOf(id);
        const remaining = open_ids.filter((open_id) => open_id !== id);
        set_open_ids(remaining);
        handle_keep(id);
        if(id === active_id) set_active_id(remaining[Math.min(index, remaining.length - 1)] ?? null);
    }

    const open_scripts = open_ids.flatMap((id) => scripts[id] !== undefined ? [scripts[id]!] : []);

    return(
        <PaneGroup id="scripts" orientation="horizontal">
            <MainPane>
            <PaneGroup id="scripts_main" orientation="vertical">
                <UIPanel id="source" key="script_source" level="level_2" default_size={100} min_size="8em">
                    <ScriptTabs scripts={open_scripts} active_id={active_id} preview_id={preview_id} on_select={set_active_id} on_keep={handle_keep} on_close={handle_close}/>
                </UIPanel>
            </PaneGroup>
            </MainPane>
            <ScriptSidebar
                on_select={handle_select}
                on_reselect={handle_keep}
                on_activate={handle_activate}
            />
        </PaneGroup>

    );

}


export default ScriptManager;
