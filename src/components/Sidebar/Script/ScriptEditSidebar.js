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
    SidebarBlockLayout,
    SidebarBlockTitleLayout
} from "../../UI_elements";


let ScriptEditSidebar = props =>{

    let handle_edit_field = (event) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.selected_script.edit_field(event.target.name, event.target.value);
        }
    }

    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Script Peripherals"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <InputField inline name='name' placeholder={props.selected_script.name} onKeyDown={handle_edit_field} label='name'/>
                <InputField inline name='path' placeholder={props.selected_script.path} onKeyDown={handle_edit_field} label='path'/>
                <InputField inline name='triggers' placeholder={props.selected_script.triggers} onKeyDown={handle_edit_field} label='triggers'/>
            </FormLayout>
        </SidebarBlockLayout>
    )
};

export default ScriptEditSidebar;