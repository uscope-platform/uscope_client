import React  from 'react';

import {useSelector} from "react-redux"
import SidebarLayout from "../UI_elements/Layouts/SidebarLayout";
import PeripheralsSidebar from "./PeripheralsSidebar";


let  Sidebar = props =>{

    const settings = useSelector(state => state.settings);

    if(!settings.current_view_requires_sidebar)
        return null;

    return(
        <SidebarLayout>
            <PeripheralsSidebar />
        </SidebarLayout>
    );
};

export default Sidebar;
