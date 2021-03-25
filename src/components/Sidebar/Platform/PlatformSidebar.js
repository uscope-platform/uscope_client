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
        settings.server.platform_proxy.add_user({user:username,password:pass, role:role}).then(res =>{
            dispatch(setSetting(["refresh_user_view", !settings.refresh_user_view]));
        })
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
