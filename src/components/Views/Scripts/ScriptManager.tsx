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

import React, {useState} from 'react';


import {
    FormLayout,
    InputField,
    SimpleContent,
    UIPanel
} from "#UI/index.js"
import {MainPane, PaneGroup} from "#UI/index.js";
import {up_script} from "#client_core/index.js";
import ScriptsEditor from "./ScriptsEditor.js";
import ScriptSidebar from "./ScriptSidebar.js";
import {useAppSelector} from "#redux/hooks.js";

interface ScriptManagerProps {}

let ScriptManager = (props: ScriptManagerProps) =>{

    const [selected_script, set_selected_script] = useState(up_script.get_empty_script());

    const scripts =  useAppSelector(state => state.scripts);

    let handle_edit_field = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            selected_script.edit_field(event.currentTarget.name as keyof up_script, event.currentTarget.value);
        }
    }


    let handle_select = (selection: number) =>{
        let new_sel = scripts[selection]
        if(new_sel===undefined) return;
        set_selected_script( new up_script(new_sel) );
    }

    return(
        <PaneGroup id="scripts" orientation="horizontal">
            <MainPane>
            <PaneGroup id="scripts_main" orientation="vertical">
                <UIPanel id="properties" key="script_properties" level="level_2" default_size={20} min_size="6em">
                    <SimpleContent name="Script Properties">
                        <FormLayout>
                            <InputField inline name='name' placeholder={selected_script.name}
                                        onKeyDown={handle_edit_field} label='name'/>
                        </FormLayout>
                    </SimpleContent>
                </UIPanel>

                <UIPanel id="source" key="script_source" level="level_2" default_size={80} min_size="8em">
                    <SimpleContent name="Script Source Code">
                        <ScriptsEditor script={selected_script}/>
                    </SimpleContent>
                </UIPanel>
            </PaneGroup>
            </MainPane>
            <ScriptSidebar
                on_select={handle_select}
            />
        </PaneGroup>

    );

}


export default ScriptManager;