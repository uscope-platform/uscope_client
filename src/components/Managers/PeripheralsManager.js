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
    ColorTheme,
    InputField,
    RegisterProperties,
    StyledScrollbar, TabbedContent, UIPanel
} from "../UI_elements"

import {up_peripheral} from "../../client_core"
import {Responsive, WidthProvider} from "react-grid-layout";
import {MdAdd} from "react-icons/md";


let PeripheralsManager = (props)=>{

    const selected_peripheral =  useSelector(state => new up_peripheral(state.peripherals[state.settings.current_peripheral]))


    const ResponsiveGridLayout = WidthProvider(Responsive);

    const peripherals = useSelector(state => state.peripherals);
    const settings = useSelector(state => state.settings);

    const [new_register, set_new_register] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

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
    let handle_add_register = () => {
        set_new_register(true);
    }

    let handle_add_register_done = (event) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            selected_peripheral.add_register(event.target.value).then();
            set_new_register(false);
        } else if (event.key ==="Escape"){
            set_new_register(false);
        }
    }

    if(!settings.current_peripheral)
        return <></>;

    let get_tabs_content = ()=>{
        return([
            <div>
                <InputField inline name="edit_name" defaultValue={peripherals[settings.current_peripheral].peripheral_name} onKeyDown={handleEditName} label="Name"/>
                <InputField inline name="edit_version" defaultValue={peripherals[settings.current_peripheral].version} onKeyDown={handleEditVersion} label="Version"/>
            </div>,
            <div>
                <MdAdd id="register" size={ColorTheme.icons_size} onClick={handle_add_register} color={ColorTheme.icons_color}/>
                {new_register &&
                    <InputField name="register" compact label="Register Name" onKeyDown={handle_add_register_done}/>
                }
                <StyledScrollbar>
                    {
                        peripherals[settings.current_peripheral].registers.map((reg)=>{
                            return(
                                <RegisterProperties peripheral={selected_peripheral} forceUpdate={forceUpdate} register={reg}/>
                            )
                        })
                    }
                </StyledScrollbar>
            </div>
        ])
    }

    let get_tabs_names = ()=>{
        return ["Peripheral properties", "Registers"]
    }



    return(
        <ResponsiveGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            useCSSTransforms={false}
        >
            <UIPanel key="new_props" data-grid={{x: 0, y: 0, w: 24, h: 6, static: true}} level="level_2">
                <TabbedContent names={get_tabs_names()} contents={get_tabs_content()}/>
            </UIPanel>
        </ResponsiveGridLayout>
    );
}

export default PeripheralsManager;
