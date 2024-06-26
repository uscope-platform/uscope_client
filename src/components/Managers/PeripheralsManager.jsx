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

import {useSelector} from "react-redux"


import {
    CardStack, Checkbox,
    InputField,
    RegisterProperties,
    SimpleContent, UIPanel
} from "../UI_elements"

import {get_next_id, up_peripheral} from "../../client_core"
import ManagerToolbar from "./ManagerToolbar";
import PeripheralsSidebar from "../Sidebar/PeripheralsSidebar";


let PeripheralsManager = (props)=>{

    const peripherals = useSelector(state => state.peripherals);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [selected_peripheral, set_selected_peripheral] = useState({registers:[], parametric:false, _get_periph:()=>{return{}}});

    let handle_select = (sel) =>{
        set_selected_peripheral(new up_peripheral(peripherals[sel]));
    }

    let handleEditVersion = (event) =>{
        if (event.key ==="Enter"){
            selected_peripheral.set_version(event.target.value).then();
        }
    }

    let handleEditName = (event) =>{
        if (event.key ==="Enter"){
            selected_peripheral.edit_name(event.target.value).then();
        }
    }
    let handleEditParametric = (event)=>{
        selected_peripheral.edit_parametric(event.target.checked).then(()=>{
            forceUpdate();
        });
    }


    let handle_add_new = (item_type, old_items, title_prop) =>{

        let ids = Object.values(old_items).map((item)=>{
            const regex = new RegExp("new_"+item_type+"_(\\d+)", 'g');
            let match = Array.from(item[title_prop].matchAll(regex), m => m[1]);
            if(match.length>0){
                return match;
            } else{
                return null;
            }
        });
        ids = ids.filter(Boolean);
        let name ="new_" + item_type + "_" + get_next_id(ids.sort());
        selected_peripheral.add_register(name).then();
    }


    let render_periph_prop = () => {
        return (<div>
            <InputField inline name="edit_name" defaultValue={selected_peripheral._get_periph().peripheral_name}
                        onKeyDown={handleEditName} label="Name"/>
            <InputField inline name="edit_version" defaultValue={selected_peripheral._get_periph().version}
                        onKeyDown={handleEditVersion} label="Version"/>
            <Checkbox name='parametric' value={selected_peripheral._get_periph().parametric}
                      onChange={handleEditParametric} label="Parametric"/>
        </div>)
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
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
                    <SimpleContent name="Peripheral Properties" content={render_periph_prop()}/>

                </UIPanel>
                <UIPanel style={{flexGrow: 1}}
                         key="registers" level="level_2">
                    <SimpleContent name="Registers" content={
                        <div>
                            <ManagerToolbar
                                onAdd={() => {
                                    handle_add_new("register", selected_peripheral.registers, "register_name");
                                }}
                                contentName="Register"/>
                            <CardStack>
                                {
                                    selected_peripheral.registers.map((reg) => {
                                        return (
                                            <RegisterProperties
                                                key={reg.ID}
                                                peripheral={selected_peripheral}
                                                forceUpdate={forceUpdate}
                                                register={reg}
                                                parametric={selected_peripheral.parametric}
                                            />
                                        )
                                    })
                                }
                            </CardStack>
                        </div>
                    }/>
                </UIPanel>
            </div>
            <PeripheralsSidebar on_select={handle_select}/>
        </div>

    );
}

export default PeripheralsManager;
