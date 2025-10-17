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
} from "@UI"
import {up_script} from "#client_core";
import ScriptsEditor from "./ScriptsEditor";
import ScriptSidebar from "./ScriptSidebar";
import {useAppSelector} from "#redux/hooks.js";

let ScriptManager = (props) =>{

    const [selected_script, set_selected_script] = useState({});

    const scripts =  useAppSelector(state => state.scripts);

    let handle_edit_field = (event) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            selected_script.edit_field(event.target.name, event.target.value);
        }
    }


    let handle_select = (selection) =>{
        set_selected_script( new up_script(scripts[selection]) );
    }

    return(
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap:10
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                flexGrow:1,
                gap: 10
            }}>
                <UIPanel key="script_properties" level="level_2">
                    <SimpleContent name="Script Properties">
                        <FormLayout>
                            <InputField inline name='name' placeholder={selected_script.name}
                                        onKeyDown={handle_edit_field} label='name'/>
                            <InputField inline name='path' placeholder={selected_script.path}
                                        onKeyDown={handle_edit_field} label='path'/>
                            <InputField inline name='triggers' placeholder={selected_script.triggers}
                                        onKeyDown={handle_edit_field} label='triggers'/>
                        </FormLayout>
                    </SimpleContent>
                </UIPanel>

                <UIPanel key="script_source" level="level_2">
                    <SimpleContent name="Script Source Code">
                        <ScriptsEditor script={selected_script}/>
                    </SimpleContent>
                </UIPanel>
            </div>
            <ScriptSidebar
                on_select={handle_select}
            />
        </div>

    );

}


export default ScriptManager;