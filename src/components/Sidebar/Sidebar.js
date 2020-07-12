import React  from 'react';
import { withRouter } from "react-router";

import SidebarLayout from "../UI_elements/Layouts/SidebarLayout";
import PeripheralsSidebar from "./Peripheral/PeripheralsSidebar";


let  Sidebar = props =>{


    switch (props.location.pathname) {
        case "/peripherals_manager":
            return(
                <SidebarLayout>
                    <PeripheralsSidebar />
                </SidebarLayout>
                );
        case "/applications_manager":
            return(
                <SidebarLayout>

                </SidebarLayout>
            );
        case "/script_manager":
            return(
                <SidebarLayout>

                </SidebarLayout>
            );
        case "/plot":
            return(
                <SidebarLayout>

                </SidebarLayout>
            );
        default:
            return null;
    }
};

export default withRouter(Sidebar);
