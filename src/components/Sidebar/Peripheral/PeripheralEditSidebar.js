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
    InputField,
    Label,
    RegisterProperties,
    SidebarBlockLayout,
    SidebarBlockTitleLayout,
    SidebarContentLayout,
    StyledScrollbar
} from "../../UI_elements";
import {BlockTitle} from "../../UI_elements/";
import {Add} from "grommet-icons";

const TitleLayout = styled.div`
  margin-left: auto;
  margin-right: auto;
`

let  PeripheralEditSidebar = props =>{
    const peripherals = useSelector(state => state.peripherals);
    const settings = useSelector(state => state.settings);

    const [edit_label, set_edit_label] = useState(false);
    const [new_register, set_new_register] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);


    let handleEditVersion = () =>{
        set_edit_label(true);
    }

    let handleEditVersionDone = (event) =>{
        if(event.key ==="Escape"){
            set_edit_label(false);
        } else if (event.key ==="Enter"){
            set_edit_label(false)
            props.selected_peripheral.set_version(event.target.value).then();
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

    return(
        <SidebarContentLayout peripheral>
            <TitleLayout>
                <BlockTitle>{peripherals[settings.current_peripheral].peripheral_name}</BlockTitle>
                {edit_label
                    ? <InputField compact name="edit_version" defaultValue={peripherals[settings.current_peripheral].version} onKeyDown={handleEditVersionDone} label="Version"/>
                    : <Label onDoubleClick={handleEditVersion}>{"Version: "+peripherals[settings.current_peripheral].version}</Label>
                }
            </TitleLayout>
            <SidebarBlockLayout>
                <SidebarBlockTitleLayout>
                    <label style={{fontSize:'20px',fontWeight:600}}>{"Registers"}</label>
                    <Add id="register" size={"medium"} onClick={handle_add_register} color='white'/>
                </SidebarBlockTitleLayout>
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
            </SidebarBlockLayout>
        </SidebarContentLayout>
    );
};

export default PeripheralEditSidebar;
