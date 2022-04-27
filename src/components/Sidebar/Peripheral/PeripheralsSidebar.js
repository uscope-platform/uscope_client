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

import {useSelector} from "react-redux";
import PeripheralEditSidebar from "./PeripheralEditSidebar";

import {BlockTitle, InputField, SidebarContentLayout} from "../../UI_elements";
import {create_peripheral_obj} from "../../../utilities/PeripheralUtilities";
import {create_peripheral} from "../../../client_core";

let  PeripheralsSidebar = props =>{
    const settings = useSelector(state => state.settings);


    let handle_add_peripheral = (event) =>{

        if (event.key === "Enter") {
            let peripheral = create_peripheral_obj(event.target.value)
            create_peripheral(peripheral).then();
        }
    };


    if(!settings.current_peripheral)
        return (
            <SidebarContentLayout peripheral>
                <BlockTitle>Peripheral actions</BlockTitle>
                <InputField compact label="Add a peripheral" onKeyDown={handle_add_peripheral}/>
            </SidebarContentLayout>
        );

    return(
        <PeripheralEditSidebar/>
    );
};

export default PeripheralsSidebar;
