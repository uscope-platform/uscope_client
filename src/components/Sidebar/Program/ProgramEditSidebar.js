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
    FormLayout, InputField,
} from "../../UI_elements";
import {SelectField} from "../../UI_elements/Select";

let ProgramEditSidebar = props =>{

    let handle_name_change = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.selected_program.edit_field(event.target.name, event.target.value);
        }
    }

    let handleTypeChange = (event) =>{
        props.selected_program.edit_field(event.target.name, event.target.value).then();
    }

    let allowed_types = ["asm", "C"];
    return(

            <FormLayout>
                <InputField inline name='name' placeholder={props.selected_program.name} onKeyDown={handle_name_change} label="Name"/>
                <SelectField label="Program type" onChange={handleTypeChange} defaultValue={props.selected_program.program_type}
                             name="program_type" placeholder="Program type" options={allowed_types}/>
            </FormLayout>
    )
};

export default ProgramEditSidebar;