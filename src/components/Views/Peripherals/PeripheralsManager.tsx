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
    ItemsEditor, UIPanel
} from "#UI/index.js"
import {MainPane, PaneGroup} from "#UI/index.js";

import {get_next_id, up_peripheral, up_register} from "#client_core/index.js"
import {useStoredInstance} from "#redux/useStoredInstance.js"
import PeripheralsSidebar from "./PeripheralsSidebar.jsx";
import {RegisterProperties} from './RegisterProperties.js'
import {useAppSelector} from "#redux/hooks.js";

interface PeripheralsManagerProps {}

let PeripheralsManager = (props: PeripheralsManagerProps)=>{

    const peripherals = useAppSelector(state => state.peripherals);

    const [data_version, forceUpdate] = useReducer(x => x + 1, 0);

    const [periph_selector, set_periph_selector] = useState(0);

    // read from the store, so that what is added or edited shows right away
    const selected_peripheral = useStoredInstance(peripherals[periph_selector], (periph) => new up_peripheral(periph), () => up_peripheral.construct_empty(9999));

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
                    <div style={{flex: 1, minHeight: 0, overflowY: "auto", padding: "0.5em"}}>
                        {selected_peripheral.id === 9999
                            ? <div style={{padding: "0.5em", opacity: 0.6}}>Select a peripheral to edit its registers</div>
                            : (
                                // keyed by the peripheral, so that the selection starts afresh for another one
                                <ItemsEditor
                                    key={selected_peripheral.id}
                                    items={selected_peripheral.registers}
                                    noun="registers"
                                    name={(reg) => reg.register_name}
                                    description={(reg) => reg.ID}
                                    onAdd={handle_add_new}
                                    onRename={async (reg, name) => {
                                        await new up_register(reg, selected_peripheral.id).edit_name(name);
                                        forceUpdate();
                                    }}
                                    onRemove={async (reg) => {
                                        await up_register.remove_register(selected_peripheral.id, reg.ID);
                                        forceUpdate();
                                    }}
                                >
                                    {(reg) => (
                                        <RegisterProperties
                                            peripheral={selected_peripheral}
                                            forceUpdate={forceUpdate}
                                            register={reg}
                                        />
                                    )}
                                </ItemsEditor>
                            )
                        }
                    </div>
                </UIPanel>
            </PaneGroup>
            </MainPane>
            <PeripheralsSidebar on_select={handle_select}/>
        </PaneGroup>

    );
}

export default PeripheralsManager;
