import React from 'react';


import {useSelector} from "react-redux";


import {BlockTitle, InputField, SidebarContentLayout} from "../../UI_elements";


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
