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

import ScriptEditSidebar from "./ScriptEditSidebar";
import {useSelector} from "react-redux";
import {BlockTitle, SidebarContentLayout} from "../../UI_elements";
import {up_script} from "../../../client_core/data_models/up_script";



let  ScriptSidebar = props =>{

    const selected_script =  useSelector(state => new up_script(state.scripts[state.settings.selected_script]))

    if(!selected_script.id)
        return (
            <SidebarContentLayout peripheral>
                <BlockTitle>Scripts actions</BlockTitle>
            </SidebarContentLayout>
        );

    return(
        <ScriptEditSidebar selected_script={selected_script}/>
    );
};

export default ScriptSidebar;
