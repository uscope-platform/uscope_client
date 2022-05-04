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

import {useDispatch, useSelector} from "react-redux";
import PeripheralEditSidebar from "./PeripheralEditSidebar";

import {BlockTitle, InputField, SidebarContentLayout} from "../../UI_elements";
import {up_peripheral} from "../../../client_core/data_models/up_peripheral";
import {addPeripheralDone} from "../../../redux/Actions/peripheralsActions";

let  PeripheralsSidebar = props =>{
    const settings = useSelector(state => state.settings);

    const dispatch = useDispatch();

    let handle_add_peripheral = (event) =>{

        if (event.key === "Enter") {
            let peripheral = up_peripheral.construct_empty(event.target.value);
            peripheral.add_remote().then(()=>{
                dispatch(addPeripheralDone(peripheral));
            })

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
