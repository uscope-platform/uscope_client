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

import React, {useEffect} from 'react';

import {useDispatch, useSelector} from "react-redux";


import {
    get_next_id,
    import_application,
    up_application,
} from "../../client_core";

import {setSetting} from "../../redux/Actions/SettingsActions";
import {addApplication} from "../../redux/Actions/applicationActions";

import SidebarBase from "./SidebarBase";

let  ApplicationSidebar = props =>{

    const applications_redux = useSelector(state => state.applications);
    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();

    let handleImport = (app) =>{
        let id = get_next_id(Object.values(applications_redux).map(a => a[props.selection_key]).sort());
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
            initial_value={applications_redux[settings.application].application_name}
            onSelect={props.on_select}
        />
    );

};

export default ApplicationSidebar;
