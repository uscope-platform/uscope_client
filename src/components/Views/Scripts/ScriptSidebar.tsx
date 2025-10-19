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

import React, {useContext, useReducer} from 'react';

import {up_script} from "#client_core/index.js";
import {SidebarBase} from "#UI/index.js";
import {ApplicationContext} from "#src/AuthApp.jsx";
import {useAppSelector} from "#redux/hooks.js";

interface ScriptSidebarProps {
    on_select: (id: number) => void;
}

let ScriptSidebar = (props: ScriptSidebarProps) =>{

    const application = useContext(ApplicationContext);

    const scripts_store = useAppSelector(state => state.scripts);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handleAdd = (added_obj: any) =>{
        application.add_selected_script(added_obj.id.toString()).then(()=>{
            forceUpdate();
        });
    };

    let handleRemove = (deleted: any) =>{
        application.remove_selected_script(deleted.id.toString()).then();
    };

    return(
        <SidebarBase
            objects={scripts_store}
            selection_key="id"
            template={up_script}
            items_filter={application.scripts}
            display_key="name"
            content_name="Script"
            onDelete={handleRemove}
            onSelect={props.on_select}
            onAdd={handleAdd}
        />
    );
}


export default ScriptSidebar;
