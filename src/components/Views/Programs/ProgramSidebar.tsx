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

import {up_program} from "#client_core/index.js";
import ProgramProperties from "./ProgramProperties.js";
import ProgramHeaders from "./ProgramHeaders.js";

import {SidebarBase, SidebarColumn} from "#UI/index.js";
import {ApplicationContext} from "#src/AuthApp.jsx";
import {useAppSelector} from "#redux/hooks.js";


interface ProgramSidebarProps {
    on_select: (id: number) => void;
    on_reselect: (id: number) => void;
    on_activate: (id: number) => void;
    /// the program that is being edited, when there is one: it has its own panels
    program: up_program | null;
}

let  ProgramSidebar = (props: ProgramSidebarProps) =>{

    const programs_store = useAppSelector(state => state.programs);
    const application = useContext(ApplicationContext);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handleAdd = (added_obj: {id: any, object:any}) =>{
        application.add_selected_program(added_obj.id).then(()=>{
            forceUpdate();
        });
    };

    let handleRemove = (deleted: any) =>{
        application.remove_selected_program(deleted.id).then();
    };
    let handle_import_done = (obj: any) =>{
        application.add_selected_program(obj.id).then();
        forceUpdate();
    }

    return(
        <SidebarColumn style={{padding: "10px 0"}} panels={[{title: "Program List", content: (
            <SidebarBase
                objects={programs_store}
                selection_key="id"
                template={up_program}
                items_filter={application.programs.map(s=>s.toString())}
                display_key="name"
                content_name="Program"
                type_prop="type"
                onDelete={handleRemove}
                onAdd={handleAdd}
                omImportDone={handle_import_done}
                onSelect={props.on_select}
                onReselect={props.on_reselect}
                onActivate={props.on_activate}
            />
        )},
            ...(props.program ? [
                {title: "Program Properties", content: <ProgramProperties program={props.program}/>},
                // only the C programs include headers
                ...(props.program.type === "C" ? [
                    {title: "Headers", content: <ProgramHeaders program={props.program} programs={programs_store}/>}
                ] : [])
            ] : [])
        ]}/>
    );

};

export default ProgramSidebar;
