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


import {
    get_next_id,
    import_application,
    up_application,
} from "#client_core";
import {SidebarBase} from "@UI";

import {addApplication} from "#redux";
import {useAppSelector} from "#redux/hooks.js";


let  ApplicationSidebar = props =>{

    const applications_redux = useAppSelector(state => state.applications);

    let handleImport = (app) =>{
        let id = get_next_id(Object.values(applications_redux).map(a => a['id']).sort());
        import_application(app, id).then(()=>{
            addApplication(app);
        })
    };


    return(
        <SidebarBase
            objects={applications_redux}
            selection_key="id"
            template={up_application}
            display_key="application_name"
            content_name="Applications"
            selector="selected_application"
            onImport={handleImport}
            initial_value={props.application}
            onSelect={props.on_select}
        />
    );

};

export default ApplicationSidebar;
