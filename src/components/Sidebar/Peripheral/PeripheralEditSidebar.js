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

import React, {useState} from 'react';

import styled from "styled-components";

import {useSelector} from "react-redux";
import {create_register} from "../../../utilities/PeripheralUtilities";
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
import PeripheralImage from "./PeripheralImage";
import {Add} from "grommet-icons";
import {send_image, edit_peripheral} from "../../../client_core";

const TitleLayout = styled.div`
  margin-left: auto;
  margin-right: auto;
`

let  PeripheralEditSidebar = props =>{
    const peripherals = useSelector(state => state.peripherals);
    const settings = useSelector(state => state.settings);

    const [edit_label, set_edit_label] = useState(false);
    const [new_register, set_new_register] = useState(false);

    let handleEditImage = (image) =>{
        send_image(image, settings.current_peripheral);
        //SEND CHANGE COMMAND TO THE SERVER
        let edit ={peripheral:settings.current_peripheral, action:"change_image", path:image.name};

        edit_peripheral(edit);
    }

    let handleEditVersion = () =>{
        set_edit_label(true);
    }

    let handleEditVersionDone = (event) =>{
        if(event.key ==="Escape"){
            set_edit_label(false);
        } else if (event.key ==="Enter"){
            set_edit_label(false);
            let edit ={peripheral:settings.current_peripheral, action:"edit_version", version:parseFloat(event.target.value)};
            edit_peripheral(edit);
        }

    }

    let handle_add_register = () => {
        set_new_register(true);
    }

    let handle_add_register_done = (event) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            let reg_name = event.target.value;
            let edit ={peripheral:settings.current_peripheral, action:"add_register",register:create_register(reg_name,"single")};
            edit_peripheral(edit);
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
            <PeripheralImage image={settings.server_url + peripherals[settings.current_peripheral].image} done={handleEditImage}/>
                <SidebarBlockLayout>
                    <SidebarBlockTitleLayout>
                        <label style={{fontSize:'20px',fontWeight:600}}>{"Registers"}</label>
                        <Add id="register" size={"medium"} onClick={handle_add_register} color='white'/>
                    </SidebarBlockTitleLayout>
                    {new_register &&
                    <InputField name="register" compact label="Channel Name" onKeyDown={handle_add_register_done}/>
                    }
                    <StyledScrollbar>
                        {
                            peripherals[settings.current_peripheral].registers.map((reg)=>{
                                return(
                                    <RegisterProperties peripheral={settings.current_peripheral} register={reg}/>
                                )
                            })
                        }
                    </StyledScrollbar>
                </SidebarBlockLayout>
        </SidebarContentLayout>
    );
};

export default PeripheralEditSidebar;
