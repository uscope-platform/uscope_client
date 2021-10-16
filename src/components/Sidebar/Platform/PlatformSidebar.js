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

import {useDispatch, useSelector} from "react-redux";
import {
    BlockTitle,
    Button,
    FormLayout,
    InputField,
    SidebarContentLayout
} from "../../UI_elements";
import {setSetting} from "../../../redux/Actions/SettingsActions";
import {SelectField} from "../../UI_elements/Select";



let  PlatformSidebar = props =>{

    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch()

    let handle_add_user = (event) =>{

        event.preventDefault();
        let username = event.target.user.value;
        let pass = event.target.pass.value;
        let role = event.target.role.value;
        if(props.onboarding){
            settings.server.platform_proxy.do_onboarding({user:username,password:pass, role:role}).then(res =>{
                dispatch(setSetting(["refresh_user_view", !settings.refresh_user_view]));
            })
            props.onboarding_done();
        } else{
            settings.server.platform_proxy.add_user({user:username,password:pass, role:role}).then(res =>{
                dispatch(setSetting(["refresh_user_view", !settings.refresh_user_view]));
            })
        }

    };

    if(!settings.selected_program)
        return (
            <SidebarContentLayout peripheral>
                <BlockTitle>Platform actions</BlockTitle>
                <form onSubmit={handle_add_user}>
                    <FormLayout>
                        <InputField inline name="user" label="Username"/>
                        <InputField inline name="pass" label="Password"/>
                        <SelectField label="Role" defaultValue="role"
                                     name="role" placeholder="Role" options={["admin", "user", "operator"]}/>
                        <Button> Submit </Button>
                    </FormLayout>
                </form>
            </SidebarContentLayout>
        );

    return(
        <></>
    );
};

export default PlatformSidebar;
