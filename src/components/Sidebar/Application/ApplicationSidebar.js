import React from 'react';


import {useSelector} from "react-redux";


import SidebarContentLayout from "../../UI_elements/Layouts/SidebarContentLayout";

let  ApplicationSidebar = props =>{
    const settings = useSelector(state => state.settings);

    if(!settings.current_peripheral)
        return (
            <SidebarContentLayout>


            </SidebarContentLayout>
        );

};

export default ApplicationSidebar;
