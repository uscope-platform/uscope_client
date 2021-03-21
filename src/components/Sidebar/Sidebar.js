import React from 'react';
import {withRouter} from "react-router";

import {SidebarLayout} from "../UI_elements";
import PeripheralsSidebar from "./Peripheral/PeripheralsSidebar";
import ApplicationSidebar from "./Application/ApplicationSidebar";
import PlotSidebar from "./Plot/PlotSidebar";
import ScriptSidebar from "./Script/ScriptSidebar";
import ProgramSidebar from "./Program/ProgramSidebar";
import PlatformSidebar from "./Platform/PlatformSidebar";

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
        case "/program_manager":
            return (
                <SidebarLayout>
                    <ProgramSidebar/>
                </SidebarLayout>
            );
        case "/plot":
            return(
                <SidebarLayout>
                    <PlotSidebar/>
                </SidebarLayout>
            );
        case "/platform_manager":
            return(
                <SidebarLayout>
                    <PlatformSidebar/>
                </SidebarLayout>
            );
        default:
            return null;
    }
};

export default withRouter(Sidebar);
