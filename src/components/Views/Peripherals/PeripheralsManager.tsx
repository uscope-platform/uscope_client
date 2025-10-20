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

import React, {useEffect, useReducer, useState} from 'react';


import {
    CardStack, ColorTheme,
    InputField,
    SimpleContent, UIPanel
} from "#UI/index.js"

import {get_next_id, up_peripheral} from "#client_core/index.js"
import PeripheralsSidebar from "./PeripheralsSidebar.jsx";
import {MdAdd} from "react-icons/md";
import {RegisterProperties} from './RegisterProperties.js'
import {useAppSelector} from "#redux/hooks.js";

interface PeripheralsManagerProps {}

let PeripheralsManager = (props: PeripheralsManagerProps)=>{

    const peripherals = useAppSelector(state => state.peripherals);

    const [data_version, forceUpdate] = useReducer(x => x + 1, 0);

    const [selected_peripheral, set_selected_peripheral] = useState(up_peripheral.construct_empty(9999));

    const [periph_selector, set_periph_selector] = useState(0);

    useEffect(()=>{
        let periph = peripherals[periph_selector];
        if(periph){
            set_selected_peripheral(periph);
        }
    }, [data_version])

    let handle_select = (sel: number) =>{
        let periph = peripherals[sel];
        if(periph){
            set_periph_selector(sel);
            set_selected_peripheral(periph);
        }
    }

    let handleEditVersion = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if (event.key ==="Enter"){
            selected_peripheral.set_version(event.currentTarget.value).then();
        }
    }

    let handleEditName = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if (event.key ==="Enter"){
            selected_peripheral.edit_name(event.currentTarget.value).then();
        }
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

        let name ="new_register_" + get_next_id(ids.sort());
        selected_peripheral.add_register(name).then();
    }


    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "5fr 1.5fr",
            gap: 10,
            height: "100%"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flexGrow: 1,
                height: "100%"
            }}>
                <UIPanel style={{minHeight:"150px"}} key="properties" level="level_2">
                    <SimpleContent name="Peripheral Properties">
                        <div>
                            <InputField inline name="edit_name"
                                        defaultValue={selected_peripheral.name}
                                        onKeyDown={handleEditName} label="Name"/>
                            <InputField inline name="edit_version"
                                        defaultValue={selected_peripheral.version}
                                        onKeyDown={handleEditVersion} label="Version"/>
                        </div>
                    </SimpleContent>
                </UIPanel>
                <UIPanel style={{flexGrow: 1}}
                         key="registers" level="level_2">
                    <SimpleContent name="Registers">
                        <div>
                            <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
                                <MdAdd
                                    onClick={() => {handle_add_new();}}
                                    size={ColorTheme.icons_size}
                                    style={{marginLeft: "0.3em"}}
                                    color={ColorTheme.icons_color}
                                />
                            </div>
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
                    </SimpleContent>
                </UIPanel>
            </div>
            <PeripheralsSidebar on_select={handle_select}/>
        </div>

    );
}

export default PeripheralsManager;
