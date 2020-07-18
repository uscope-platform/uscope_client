import React from 'react';
import {withRouter} from "react-router";

import {SidebarLayout} from "../UI_elements";
import PeripheralsSidebar from "./Peripheral/PeripheralsSidebar";
import ApplicationSidebar from "./Application/ApplicationSidebar";
import PlotSidebar from "./Plot/PlotSidebar";
import ScriptSidebar from "./Script/ScriptSidebar";

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
                    <ApplicationSidebar/>
                </SidebarLayout>
            );
        case "/script_manager":
            return(
                <SidebarLayout>
                    <ScriptSidebar/>
                </SidebarLayout>
            );
        case "/plot":
            return(
                <SidebarLayout>
                    <PlotSidebar/>
                </SidebarLayout>
            );
        default:
            return null;
    }
};

export default withRouter(Sidebar);
