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

import React, {useReducer, useState} from 'react';


import {
    CardStack,
    Toolbar, ToolbarButton, UIPanel
} from "#UI/index.js"
import {MainPane, PaneGroup} from "#UI/index.js";

import {get_next_id, up_peripheral} from "#client_core/index.js"
import PeripheralsSidebar from "./PeripheralsSidebar.jsx";
import {MdAdd} from "react-icons/md";
import {RegisterProperties} from './RegisterProperties.js'
import {useAppSelector} from "#redux/hooks.js";

interface PeripheralsManagerProps {}

let PeripheralsManager = (props: PeripheralsManagerProps)=>{

    const peripherals = useAppSelector(state => state.peripherals);

    const [data_version, forceUpdate] = useReducer(x => x + 1, 0);

    const [periph_selector, set_periph_selector] = useState(0);

    // read from the store at every render, so that what is added or edited shows right away
    const stored_peripheral = peripherals[periph_selector];
    const selected_peripheral = stored_peripheral !== undefined ? new up_peripheral(stored_peripheral) : up_peripheral.construct_empty(9999);

    let handle_select = (sel: number) =>{
        if(peripherals[sel]) set_periph_selector(sel);
    }

    let handle_add_new = () =>{

        let ids = Object.values(selected_peripheral.registers).map((item)=>{
            const regex = new RegExp("new_register_(\\d+)", 'g');
            let match = Array.from(item["register_name"].matchAll(regex), m => m[1]);
            if(match.length>0 && match[0] !== undefined){
                return  parseInt(match[0]);
            } else{
                return;
            }
        }).flat().filter((id): id is number=> id !== undefined);

        let name ="new_register_" + get_next_id(ids);
        selected_peripheral.add_register(name).then();
    }


    return (
        <PaneGroup id="peripherals" orientation="horizontal">
            <MainPane>
            <PaneGroup id="peripherals_main" orientation="vertical">
                <UIPanel id="registers" key="registers" level="level_2" default_size={100} min_size="8em" collapsible={false}>
                    <div style={{display: "flex", flexDirection: "column", flex: 1, minHeight: 0}}>
                        <Toolbar>
                            <ToolbarButton label="Add register" icon={<MdAdd size="1.5em"/>} enabled={selected_peripheral.id !== 9999} onClick={handle_add_new}/>
                        </Toolbar>
                        <div style={{flex: 1, minHeight: 0, overflowY: "auto"}}>
                            <CardStack>
                                {
                                    selected_peripheral.registers.map((reg) => {
                                        return (
                                            <RegisterProperties
                                                key={reg.ID}
                                                peripheral={selected_peripheral}
                                                forceUpdate={forceUpdate}
                                                register={reg}
                                            />
                                        )
                                    })
                                }
                            </CardStack>
                        </div>
                    </div>
                </UIPanel>
            </PaneGroup>
            </MainPane>
            <PeripheralsSidebar on_select={handle_select}/>
        </PaneGroup>

    );
}

export default PeripheralsManager;
