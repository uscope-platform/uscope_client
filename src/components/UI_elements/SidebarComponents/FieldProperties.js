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
import {CaretDown, CaretUp} from "grommet-icons";
import {InputField} from "../InputField";
import {Button} from "../Button";
import {SidebarCollapsableContentLayout} from "../Layouts/SidebarCollapsableContentLayout";
import {SidebarCollapsableNameLayout} from  "../Layouts/SidebarCollapsableNameLayout";
import styled from "styled-components";


export const FieldPropsLayout = styled.div`
  border-radius: 1rem;
  height: fit-content;
  padding: ${props => {
    if (props.padding) {
        return props.padding
    } else {
        return '0.2rem 0 0.4rem 0.6rem';
    }
    }};
  margin: 0.1rem 0.5rem;
  width: auto;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.dark_theme.level_4};
`



export let  FieldProperties = props =>{

    const [is_open, set_is_open] = useState(true);
    let handleOpen = ()=>{
        set_is_open(true);
    }

    let handleEditNameChange = (event) => {
        if(event.key==="Enter"){
            props.peripheral.edit_register(props.register, "register_name",event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            switch (event.target.name) {
                case "ID":
                case "offset":
                case "description":
                case "register_name":
                    props.peripheral.edit_register(props.register, event.target.name, event.target.value).then(()=>{
                        props.forceUpdate();
                    });
                    break;
                default:
                    return;
            }
        }

    }

    let handleRemove= (event) =>{
        props.peripheral.remove_register(props.register.register_name).then(()=>{
            props.forceUpdate();
        });
    }


    let renderContent = (props) =>{
        if(is_open)
            return(
                <SidebarCollapsableContentLayout>
                    <InputField inline ID="name" name="name" defaultValue={props.field.name} onKeyDown={handleEditNameChange} label="Name"/>
                    <InputField inline ID="description" name='description' defaultValue={props.field.description} onKeyDown={handleonKeyDown} label="Description"/>
                    <InputField inline ID="offset" name='offset' defaultValue={props.field.offset} onKeyDown={handleonKeyDown} label="Address offset"/>
                    <InputField inline ID="length" name='length' defaultValue={props.field.length} onKeyDown={handleonKeyDown} label="Field Size"/>
                    <Button onClick={handleRemove} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <FieldPropsLayout>
            <SidebarCollapsableNameLayout>
                <Label>{props.field.name}</Label>
                {is_open
                    ? <CaretUp size={"small"} onClick={handleClose} color='white'/>
                    : <CaretDown size={"small"} onClick={handleOpen} color='white'/>
                }
            </SidebarCollapsableNameLayout>
            {
                renderContent(props)
            }
        </FieldPropsLayout>
    );
};