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

import React, {useReducer} from 'react';

import {useSelector} from "react-redux"


import {
    CardStack, Checkbox,
    InputField,
    RegisterProperties,
    SimpleContent, UIPanel
} from "../UI_elements"

import {get_next_id, up_peripheral} from "../../client_core"
import {Responsive, WidthProvider} from "react-grid-layout";
import ManagerToolbar from "./ManagerToolbar";


let PeripheralsManager = (props)=>{

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const settings = useSelector(state => state.settings);
    const peripherals = useSelector(state => state.peripherals);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const selected_peripheral = settings.current_peripheral ?
        new up_peripheral(peripherals[parseInt(settings.current_peripheral)]) :
        {registers:[], parametric:false};

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


    if(!settings.current_peripheral)
        return <></>;


    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="properties" data-grid={{x: 0, y: 0, w: 24, h: 1, static: true}} level="level_2">
                <SimpleContent name="Peripheral Properties" content={
                    <div>
                        <InputField inline name="edit_name" defaultValue={selected_peripheral.peripheral_name} onKeyDown={handleEditName} label="Name"/>
                        <InputField inline name="edit_version" defaultValue={selected_peripheral.version} onKeyDown={handleEditVersion} label="Version"/>
                        <Checkbox name='parametric' value={selected_peripheral.parametric} onChange={handleEditParametric} label="Parametric"/>
                    </div>
                }/>

            </UIPanel>
            <UIPanel key="registers" data-grid={{x: 0, y: 1, w: 24, h: 5, static: true}} level="level_2">
                <SimpleContent name="Registers" content={
                    <div>
                        <ManagerToolbar
                            onAdd={() =>{handle_add_new("register", selected_peripheral.registers, "register_name");}}
                            contentName="Register"/>
                        <CardStack>
                            {
                                selected_peripheral.registers.map((reg)=>{
                                    return(
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
        </ResponsiveGridLayout>
    );
}

export default PeripheralsManager;
