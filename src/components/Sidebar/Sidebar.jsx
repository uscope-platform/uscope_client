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

import PeripheralsSidebar from "./PeripheralsSidebar";
import ApplicationSidebar from "./ApplicationSidebar";
import PlotSidebar from "./Plot/PlotSidebar";
import ScriptSidebar from "./ScriptSidebar";
import ProgramSidebar from "./ProgramSidebar";
import PlatformSidebar from "./PlatformSidebar";
import BitstreamSidebar from "./BitstreamSidebar";

let  Sidebar = props =>{
    let location = useLocation();

    switch (location.pathname) {
        case "/peripherals_manager":
            return(
                <PeripheralsSidebar />
                );
        case "/applications_manager":
            return(
                <ApplicationSidebar/>
            );
        case "/script_manager":
            return(
                <ScriptSidebar/>
            );
        case "/program_manager":
            return (
                <ProgramSidebar/>
            );
        case "/":
            return(
                <PlotSidebar/>
            );
        case "/platform_manager":
            return(
                <PlatformSidebar/>
            );
        case "/bitstream_manager":
            return(
                <BitstreamSidebar/>
            );
        default:
            return null;
    }
};

export default Sidebar;
