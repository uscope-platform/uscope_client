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

import {
    import_peripherals,
    up_peripheral,
} from "../../client_core";

import {addPeripheral} from "../../redux/Actions/peripheralsActions";
import SidebarBase from "./SidebarBase";

let  PeripheralsSidebar = props =>{

    const peripherals_redux = useSelector(state => state.peripherals);

    let handleImport = (content) =>{
        import_peripherals(content).then((periphs)=>{
            for(let p of periphs){
                addPeripheral(p);
            }
        }).catch((err)=>{
            alert(err);
        });
    };


    return(
        <SidebarBase
            objects={peripherals_redux}
            selection_key="id"
            template={up_peripheral}
            display_key="peripheral_name"
            content_name="Peripherals"
            selector="current_peripheral"
            onImport={handleImport}
            export_array={true}
            onSelect={props.on_select}
        />
    );
};

export default PeripheralsSidebar;


