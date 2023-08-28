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

import React, {useState} from "react";
import {Label} from "../Label";
import {MdArrowDropDown, MdArrowDropUp} from "react-icons/md";
import {InputField} from "../InputField";
import {Button} from "../Button";
import {SidebarCollapsableContentLayout} from "../Layouts/SidebarCollapsableContentLayout";
import {SidebarCollapsableNameLayout} from  "../Layouts/SidebarCollapsableNameLayout";
import styled from "styled-components";
import {up_field} from "../../../client_core";
import {ColorTheme} from "../ColorTheme";


export const FieldPropsLayout = styled.div`
  border-radius: 1rem;
  height: fit-content;
  padding: 0.2rem 0 0.4rem 0.6rem;
  margin: 0.1rem 0.5rem;
  width: auto;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background.level_4};
`



export let  HdlParameterProperties = props =>{

    const [is_open, set_is_open] = useState(true);
    let handleOpen = ()=>{
        set_is_open(true);
    }

    let handleEditNameChange = (event) => {
        if(event.key==="Enter"){
            props.onChange({type:"name", name:props.name, new_value:event.target.value});
        }
    }

    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            switch (event.target.name) {
                case "value":
                    props.onChange({type:"value", name:props.name, new_value:parseInt(event.target.value)});
                    break;
                default:
                    return;
            }
        }

    }


    let handleRemove= (event) =>{
        up_field.remove_field(props.peripheral.peripheral_name, props.register.register_name, props.field.field_name).then(()=>{
            props.forceUpdate();
        });
    }


    let renderContent = (props) =>{

        if(is_open)
            return(
                <SidebarCollapsableContentLayout>
                    <InputField inline ID="name" name="name" defaultValue={props.name} onKeyDown={handleEditNameChange} label="Name"/>
                    <InputField inline ID="value" name='value' defaultValue={props.value} onKeyDown={handleonKeyDown} label="Value"/>
                    <Button onClick={handleRemove} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <FieldPropsLayout>
            <SidebarCollapsableNameLayout>
                <Label>{props.name}</Label>
                {is_open
                    ? <MdArrowDropUp size={ColorTheme.icons_size} onClick={handleClose} color={ColorTheme.icons_color}/>
                    : <MdArrowDropDown size={ColorTheme.icons_size} onClick={handleOpen} color={ColorTheme.icons_color}/>
                }
            </SidebarCollapsableNameLayout>
            {
                renderContent(props)
            }
        </FieldPropsLayout>
    );
};