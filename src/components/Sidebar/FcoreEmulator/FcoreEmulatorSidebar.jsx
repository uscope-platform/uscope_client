// Copyright 2023 Filippo Savi
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

import {useSelector} from "react-redux";

import {up_emulator} from "../../../client_core";
import SidebarBase from "../SidebarBase";
import EmulatorNodeProperties from "./EmulatorNodeProperties";
import EmulatorEdgeProperties from "./EmulatorEdgeProperties";
import EmulatorProperties from "./EmulatorProperties";

let  FcoreEmulatorSidebar = props =>{

    const emulators_store = useSelector(state => state.emulators);


    return(
        <>
            <SidebarBase
                objects={emulators_store}
                selection_key="id"
                template={up_emulator}
                display_key="name"
                content_name="Emulator"
                selector="selected_emulator"
                height={2}
            />
            <EmulatorNodeProperties/>
            <EmulatorEdgeProperties/>
            <EmulatorProperties/>
        </>

    );

};

export default FcoreEmulatorSidebar;
