import React from 'react';


import {useSelector} from "react-redux";


import {BlockTitle, InputField, SidebarContentLayout} from "../../UI_elements";


import ApplicationEditSidebar from "./ApplicationEditSidebar";
import {create_application} from "../../../utilities/ApplicationUtilities";
import {useHistory} from "react-router-dom";


let  ApplicationSidebar = props =>{
    const settings = useSelector(state => state.settings);
    const routerHistory = useHistory();
    let handle_add_application = (event) =>{

        if (event.key === "Enter") {
            let app = create_application(event.target.value);
            settings.server.app_proxy.createApplication(app);
            if(props.onboarding){
                routerHistory.push("/")
                window.location.reload(true);
            }
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
