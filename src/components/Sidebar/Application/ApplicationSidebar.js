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


import {useSelector} from "react-redux";


import {BlockTitle, InputField, SidebarContentLayout} from "../../UI_elements";


import ApplicationEditSidebar from "./ApplicationEditSidebar";
import {create_application} from "../../../utilities/ApplicationUtilities";


let  ApplicationSidebar = props =>{
    const settings = useSelector(state => state.settings);

    let handle_add_application = (event) =>{
        if (event.key === "Enter") {
            let app = create_application(event.target.value);
            settings.server.app_proxy.createApplication(app).then();
        }
    };

    if(!settings.current_application)
        return (
            <SidebarContentLayout application>
                <BlockTitle>Applications actions</BlockTitle>
                <InputField compact label="Add an Application" onKeyDown={handle_add_application}/>
            </SidebarContentLayout>
        );

    return(
        <ApplicationEditSidebar/>
    );
};

export default ApplicationSidebar;
