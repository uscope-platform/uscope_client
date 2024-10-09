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
import {
    Label,
    InputField,
    Button,
    SidebarCollapsableContentLayout,
    SidebarCollapsableNameLayout,
    ColorTheme
} from "../../UI_elements";
import {MdArrowDropDown, MdArrowDropUp} from "react-icons/md";
import styled from "styled-components";
import {up_field} from "../../../client_core";


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



export let  FieldProperties = props =>{
    const field_obj = new up_field(props.field, props.register.ID, props.peripheral.id, props.parametric);

    const [is_open, set_is_open] = useState(true);
    let handleOpen = ()=>{
        set_is_open(true);
    }

    let handleEditNameChange = (event) => {
        if(event.key==="Enter"){
            field_obj.edit_name(event.target.value).then(()=>{
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
                case "description":
                    field_obj.edit_description(event.target.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case "offset":
                    field_obj.edit_offset(event.target.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case "length":
                    field_obj.edit_length(event.target.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case'order':
                    field_obj.edit_order(event.target.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case 'n_fields':
                    field_obj.edit_n_fields(event.target.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                default:
                    return;
            }
        }

    }


    let handleRemove= (event) =>{
        up_field.remove_field(props.peripheral.id, props.register.ID, props.field.name).then(()=>{
            props.forceUpdate();
        });
    }


    let renderContent = (props) =>{

        if(is_open)
            if(props.field.parametric){
                return(
                    <SidebarCollapsableContentLayout>
                        <InputField inline name="name" defaultValue={props.field.name} onKeyDown={handleEditNameChange} label="Name"/>
                        <InputField inline name='description' defaultValue={props.field.description} onKeyDown={handleonKeyDown} label="Description"/>
                        <InputField inline name='offset' defaultValue={props.field.offset} onKeyDown={handleonKeyDown} label="Address offset"/>
                        <InputField inline name='length' defaultValue={props.field.length} onKeyDown={handleonKeyDown} label="Field Size"/>
                        <InputField inline name='order' defaultValue={props.field.order} onKeyDown={handleonKeyDown} label="Order"/>
                        <InputField inline name='n_fields' defaultValue={props.field.n_fields[0]} onKeyDown={handleonKeyDown} label="Number of fields"/>
                        <Button onClick={handleRemove} >Remove</Button>
                    </SidebarCollapsableContentLayout>
                )
            } else {
                return(
                    <SidebarCollapsableContentLayout>
                        <InputField inline name="name" defaultValue={props.field.name} onKeyDown={handleEditNameChange} label="Name"/>
                        <InputField inline name='description' defaultValue={props.field.description} onKeyDown={handleonKeyDown} label="Description"/>
                        <InputField inline name='offset' defaultValue={props.field.offset} onKeyDown={handleonKeyDown} label="Address offset"/>
                        <InputField inline name='length' defaultValue={props.field.length} onKeyDown={handleonKeyDown} label="Field Size"/>
                        <Button onClick={handleRemove} >Remove</Button>
                    </SidebarCollapsableContentLayout>
                )
            }
        return null;
    }

    return(
        <FieldPropsLayout>
            <SidebarCollapsableNameLayout>
                <Label>{props.field.name}</Label>
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