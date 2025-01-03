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

import {useSelector} from "react-redux";
import {up_program} from "../../../client_core";

import {SidebarBase} from "../../UI_elements";
import {ApplicationContext} from "../../../AuthApp";


let  ProgramSidebar = props =>{

    const programs_store = useSelector(state => state.programs);
    const application = useContext(ApplicationContext);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handleAdd = (added_obj) =>{
        application.add_selected_program(added_obj.id.toString()).then(()=>{
            forceUpdate();
        });
    };

    let handleRemove = (deleted) =>{
        application.remove_selected_program(deleted.id.toString()).then();
    };
    let handle_import_done = (obj) =>{
        application.add_selected_program(obj.id.toString()).then();
        forceUpdate();
    }

    return(
        <SidebarBase
            objects={programs_store}
            selection_key="id"
            template={up_program}
            items_filter={application.programs}
            display_key="name"
            content_name="Program"
            selector="selected_program"
            type_prop="type"
            onDelete={handleRemove}
            onAdd={handleAdd}
            omImportDone={handle_import_done}
            onSelect={props.on_select}
        />
    );

};

export default ProgramSidebar;
