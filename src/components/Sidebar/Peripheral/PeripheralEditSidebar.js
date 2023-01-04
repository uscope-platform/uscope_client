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

import React, {useState, useReducer} from 'react';

import styled from "styled-components";

import {useSelector} from "react-redux";
import {
    ApplicationMiscFieldProperties,
    ApplicationPeripheralProperties, ApplicationSoftCoreProperties,
    InitialRegisterValue,
    InputField,
    Label, MacroProperties, ParameterProperties, PlotChannelGroupProperties, PlotChannelProperties,
    RegisterProperties,
    SidebarBlockLayout,
    SidebarBlockTitleLayout,
    SidebarContentLayout,
    StyledScrollbar, TabbedContent, UIPanel
} from "../../UI_elements";
import {BlockTitle} from "../../UI_elements/";
import {Add} from "grommet-icons";
import {Responsive, WidthProvider} from "react-grid-layout";

const TitleLayout = styled.div`
  margin-left: auto;
  margin-right: auto;
`

let  PeripheralEditSidebar = props =>{

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const peripherals = useSelector(state => state.peripherals);
    const settings = useSelector(state => state.settings);

    const [edit_label, set_edit_label] = useState(false);
    const [new_register, set_new_register] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handleEditVersion = (event) =>{
        if(event.key ==="Escape"){
            set_edit_label(false);
        } else if (event.key ==="Enter"){
            set_edit_label(false)
            props.selected_peripheral.set_version(event.target.value).then();
        }
    }

    let handleEditName = (event) =>{
        if (event.key ==="Enter"){
            props.selected_peripheral.edit_name(event.target.value).then();
        }
    }
    let handle_add_register = () => {
        set_new_register(true);
    }

    let handle_add_register_done = (event) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.selected_peripheral.add_register(event.target.value).then();
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
                <Add id="register" size={"medium"} onClick={handle_add_register} color='white'/>
                {new_register &&
                    <InputField name="register" compact label="Register Name" onKeyDown={handle_add_register_done}/>
                }
                <StyledScrollbar>
                    {
                        peripherals[settings.current_peripheral].registers.map((reg)=>{
                            return(
                                <RegisterProperties peripheral={props.selected_peripheral} forceUpdate={forceUpdate} register={reg}/>
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
        >
            <UIPanel key="new_props" data-grid={{x: 2, y: 0, w: 24, h: 6}} level="level_2">
                <TabbedContent names={get_tabs_names()} contents={get_tabs_content()}/>
            </UIPanel>
        </ResponsiveGridLayout>
    );
};

export default PeripheralEditSidebar;
