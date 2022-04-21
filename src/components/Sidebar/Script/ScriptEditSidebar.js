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
import {ScriptProperties} from "../../UI_elements/SidebarComponents/ScriptProperties";


let ScriptEditSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const scripts = useSelector(state => state.scripts);

    return(
        <SidebarBlockLayout padding={'1rem'}>
            <SidebarBlockTitleLayout>
                <label style={{fontSize:'20px',fontWeight:600}}>{"Script Peripherals"}</label>
            </SidebarBlockTitleLayout>
            <FormLayout>
                <ScriptProperties script={props.selected_script} field_name='name' field_value={scripts[props.selected_script].name}/>
                <ScriptProperties script={props.selected_script} field_name='path' field_value={scripts[props.selected_script].path}/>
                <ScriptProperties script={props.selected_script} field_name='triggers' field_value={scripts[props.selected_script].triggers}/>
            </FormLayout>
        </SidebarBlockLayout>
    )
};

export default ScriptEditSidebar;