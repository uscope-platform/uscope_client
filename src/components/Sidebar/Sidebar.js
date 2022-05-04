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
import {useLocation} from "react-router-dom";

import {SidebarLayout} from "../UI_elements";
import PeripheralsSidebar from "./Peripheral/PeripheralsSidebar";
import ApplicationSidebar from "./Application/ApplicationSidebar";
import PlotSidebar from "./Plot/PlotSidebar";
import ScriptSidebar from "./Script/ScriptSidebar";
import ProgramSidebar from "./Program/ProgramSidebar";
import PlatformSidebar from "./Platform/PlatformSidebar";
import BitstreamSidebar from "./Bitstream/BitstreamSidebar";

let  Sidebar = props =>{
    let location = useLocation();

    switch (location.pathname) {
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
        case "/":
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
        case "/bitstream_manager":
            return(
                <SidebarLayout>
                    <BitstreamSidebar/>
                </SidebarLayout>
            );
        default:
            return null;
    }
};

export default Sidebar;
