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

import React from 'react';

import {EditorTabs, MainPane, PaneGroup, UIPanel, useEditorTabs} from "#UI/index.js";
import ScriptsEditor from "./ScriptsEditor.js";
import ScriptSidebar from "./ScriptSidebar.js";
import {useAppSelector} from "#redux/hooks.js";

interface ScriptManagerProps {}

let ScriptManager = (props: ScriptManagerProps) =>{

    const scripts =  useAppSelector(state => state.scripts);

    const tabs = useEditorTabs("scripts", scripts);

    return(
        <PaneGroup id="scripts" orientation="horizontal">
            <MainPane>
            <PaneGroup id="scripts_main" orientation="vertical">
                <UIPanel id="source" key="script_source" level="level_2" default_size={100} min_size="8em">
                    <EditorTabs
                        title="Script Source Code"
                        empty_message="Select a script from the list to edit it."
                        items={tabs.open_items}
                        active_id={tabs.active_id}
                        preview_id={tabs.preview_id}
                        on_select={tabs.set_active_id}
                        on_keep={tabs.keep}
                        on_close={tabs.close}
                        render_editor={(script, on_dirty_change) => <ScriptsEditor script={script} on_dirty_change={on_dirty_change}/>}
                    />
                </UIPanel>
            </PaneGroup>
            </MainPane>
            <ScriptSidebar
                on_select={tabs.select}
                on_reselect={tabs.keep}
                on_activate={tabs.activate}
            />
        </PaneGroup>

    );

}


export default ScriptManager;
