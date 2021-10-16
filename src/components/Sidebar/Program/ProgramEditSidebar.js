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

import React from "react";
import {
    FormLayout,
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";
import {useSelector} from "react-redux";
import{ProgramProperties} from "../../UI_elements/SidebarComponents/ProgramProperties";
import {SelectField} from "../../UI_elements/Select";



let ProgramEditSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const programs = useSelector(state => state.programs);

    let handleTypeChange = (event) =>{
        let edit = {program:props.selected_program, field:event.target.name, value:event.target.value}
        settings.server.prog_proxy.edit_program(edit);
        debugger;
    }

    let allowed_types = ["asm", "C"];
    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Program"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <ProgramProperties server={settings.server} program={props.selected_program} field_name='name' field_value={programs[props.selected_program].name}/>
                <SelectField label="Program type" onChange={handleTypeChange} defaultValue={programs[props.selected_program].program_type}
                             name="program_type" placeholder="Program type" options={allowed_types}/>
            </FormLayout>
        </SidebarBlockLayout>
    )
};

export default ProgramEditSidebar;