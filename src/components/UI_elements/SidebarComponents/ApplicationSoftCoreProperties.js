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
import {SelectField} from "../Select";



export let  ApplicationSoftCoreProperties = props =>{


    const [is_open, set_is_open] = useState(false);


    let handleOpen = ()=>{
        set_is_open(true);
    }

    let handleClose = ()=>{
        set_is_open(false);
    }

    let handleProgramChange = (event)=>{
        props.application.edit_soft_core(props.core.id,event.target.name, event.target.value).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.application.edit_soft_core(props.core.id,event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemoveCore= (event) =>{
            props.application.remove_soft_core(props.core.id).then(()=>{
            props.forceUpdate();
        });
    }

    let renderContent = (props) =>{
        let programs_list = Object.keys(props.programs).map((prog_id)=>{
            return props.programs[prog_id].name;
        })
        if(is_open)
            return(
                <SidebarCollapsableContentLayout>
                    <InputField inline ID="id" name="id" defaultValue={props.core.id} onKeyDown={handleonKeyDown} label="Core ID"/>
                    <InputField inline ID="address" name='address' defaultValue={props.core.address} onKeyDown={handleonKeyDown} label="Address"/>
                    <SelectField label="Default Program" onChange={handleProgramChange} defaultValue={props.core.default_program}
                                 name="default_program" placeholder="Default Program" options={programs_list}/>
                    <Button onClick={handleRemoveCore} >Remove</Button>
                </SidebarCollapsableContentLayout>
            )
        return null;
    }

    return(
        <>
            <SidebarCollapsableNameLayout>
                <Label>{props.core.id}</Label>
                {is_open
                    ? <CaretUp size={"small"} onClick={handleClose} color='white'/>
                    : <CaretDown size={"small"} onClick={handleOpen} color='white'/>
                }
            </SidebarCollapsableNameLayout>
            {
                renderContent(props)
            }
        </>
    );
};
