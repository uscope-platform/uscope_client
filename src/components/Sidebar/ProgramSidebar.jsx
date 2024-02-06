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

import React, {useReducer} from 'react';

import {useSelector} from "react-redux";
import {up_application, up_program} from "../../client_core";

import SidebarBase from "./SidebarBase";


let  ProgramSidebar = props =>{

    const programs_store = useSelector(state => state.programs);
    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications);
    const applications_programs = applications[settings.application].programs;

    const [, forceUpdate] = useReducer(x => x + 1, 0);


    let handleAdd = (id) =>{
        let app = new up_application(applications[settings.application]);
        app.add_selected_program(id.toString()).then(()=>{
            forceUpdate();
        });
    };

    let handleRemove = (deleted) =>{
        let app = new up_application(applications[settings.application]);
        app.remove_selected_program(deleted.id.toString()).then();
    };
    let handle_import_done = (obj) =>{
        let app = new up_application(applications[settings.application]);
        app.add_selected_program(obj.id.toString()).then();
        forceUpdate();
    }

    return(
        <SidebarBase
            objects={programs_store}
            selection_key="id"
            template={up_program}
            items_filter={applications_programs}
            display_key="name"
            content_name="Program"
            selector="selected_program"
            type_prop="program_type"
            onDelete={handleRemove}
            onAdd={handleAdd}
            omImportDone={handle_import_done}
        />
    );

};

export default ProgramSidebar;
