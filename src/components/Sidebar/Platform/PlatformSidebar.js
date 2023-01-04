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
    Button,
    FormLayout,
    InputField,
    SelectField, UIPanel, SimpleContent
} from "../../UI_elements";
import {setSetting} from "../../../redux/Actions/SettingsActions";

import {add_user, do_onboarding} from "../../../client_core";
import {Responsive, WidthProvider} from "react-grid-layout";

let  PlatformSidebar = props =>{
    const ResponsiveGridLayout = WidthProvider(Responsive);

    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch()

    let handle_add_user = (event) =>{

        event.preventDefault();
        let username = event.target.user.value;
        let pass = event.target.pass.value;
        let role = event.target.role.value;
        if(props.onboarding){
            do_onboarding({user:username,password:pass, role:role}).then(res =>{
                dispatch(setSetting(["refresh_user_view", !settings.refresh_user_view]));
            })
            props.onboarding_done();
        } else{
            add_user({user:username,password:pass, role:role}).then(res =>{
                dispatch(setSetting(["refresh_user_view", !settings.refresh_user_view]));
            })
        }

    };

    if(!settings.selected_program)
        return (
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                rowHeight={30}
            >
                <UIPanel key="platform_properties" data-grid={{x: 2, y: 0, w: 24, h: 6}} level="level_2">
                    <SimpleContent name="Platform Properties" content={
                        <form onSubmit={handle_add_user}>
                            <FormLayout>
                                <InputField inline name="user" label="Username"/>
                                <InputField inline name="pass" label="Password"/>
                                <SelectField label="Role" defaultValue="role"
                                             name="role" placeholder="Role" options={["admin", "user", "operator"]}/>
                                <Button> Submit </Button>
                            </FormLayout>
                        </form>
                    }/>
                </UIPanel>
            </ResponsiveGridLayout>

        );

    return(
        <></>
    );
};

export default PlatformSidebar;
