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

import React, { useReducer} from 'react';

import {useDispatch, useSelector} from "react-redux"


import {up_application, up_script} from "../../client_core";
import SidebarBase from "./SidebarBase";

let ScriptManager = (props) =>{

    const scripts_store = useSelector(state => state.scripts);
    const applications = useSelector(state => state.applications);
    const settings = useSelector(state => state.settings);

    const applications_scripts = applications[settings.application].scripts;

    const dispatch = useDispatch();

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handleAdd = (id) =>{
        let app = new up_application(applications[settings.application]);
        app.add_selected_script(id.toString()).then(()=>{
            forceUpdate();
        });
    };

    let handleRemove = (deleted) =>{
        let app = new up_application(applications[settings.application]);
        app.remove_selected_script(deleted.id.toString()).then();
    };

    return(
        <SidebarBase
            objects={scripts_store}
            selection_key="id"
            template={up_script}
            items_filter={applications_scripts}
            display_key="name"
            content_name="Script"
            selector="selected_script"
            onDelete={handleRemove}
            onAdd={handleAdd}
        />
    );
}


export default ScriptManager;
