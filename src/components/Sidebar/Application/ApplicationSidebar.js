import React from 'react';


import {useSelector} from "react-redux";


import SidebarContentLayout from "../../UI_elements/Layouts/SidebarContentLayout";
import BlockTitle from "../../UI_elements/BlockTitle";
import InputField from "../../UI_elements/InputField";


import ApplicationEditSidebar from "./ApplicationEditSidebar";


let  ApplicationSidebar = props =>{
    const settings = useSelector(state => state.settings);

    let handle_add_application = (event) =>{

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
