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

import React from "react";
import {Label} from "../Label";
import styled from "styled-components";
import {InputField} from "../InputField";
import {Checkbox} from "../checkbox";
import {FieldProperties} from "./FieldProperties";
import {up_register} from "../../../client_core";
import {Card} from "../panels/Card";
import {SelectField} from "../Select";

const ChoicesWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`

export let  RegisterProperties = props =>{
    const register_obj = new up_register(props.register, props.peripheral.id, props.parametric);



    let handleEditNameChange = (event) => {
        if(event.key==="Enter"){
            register_obj.edit_name(event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleChange = (event)=>{
        register_obj.edit_direction(event.target).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            switch (event.target.name) {
                case "n_registers":
                    register_obj.edit_n_registers(event.target.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case "order":
                    register_obj.edit_order(event.target.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case "ID":
                    register_obj.edit_id(event.target.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case "offset":
                    register_obj.edit_offset(event.target.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case "description":
                    register_obj.edit_description(event.target.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case "register_name":
                    register_obj.edit_name(event.target.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                default:
                    return;
            }
        }

    }

    let handleRemove= (event) =>{
        up_register.remove_register(props.peripheral.id, props.register.register_name).then(()=>{
            props.forceUpdate();
        });
    }

    let render_parametric_properties = ()=>{
        if(props.register.parametric) {
            return (
                <div style={{display: "flex", flexDirection: "column"}}>
                    <InputField inline ID="order" name='order' defaultValue={props.register.order} onKeyDown={handleonKeyDown} label="Order"/>
                    <InputField inline ID="n_registers" name='n_registers' defaultValue={props.register.n_registers[0]} onKeyDown={handleonKeyDown} label="Number of Registers"/>
                </div>
            )
        } else{
            return (
                <div style={{display: "flex", flexDirection: "column"}}>
                    <InputField inline ID="offset" name='offset' defaultValue={props.register.offset} onKeyDown={handleonKeyDown} label="Address offset"/>
                </div>
            )
        }
    }





    return(
        <Card
            name={props.register.register_name}
            onRemove={handleRemove}
        >
            <InputField inline ID="register_name" name="register_name" defaultValue={props.register.register_name} onKeyDown={handleEditNameChange} label="Name"/>
            <InputField inline ID="ID" name='ID' defaultValue={props.register.ID} onKeyDown={handleonKeyDown} label="Register ID"/>

            {render_parametric_properties()}
            <InputField inline ID="description" name='description' defaultValue={props.register.description} onKeyDown={handleonKeyDown} label="Description"/>
            <ChoicesWrapper>
                <Label>Register access capabilities</Label>
                <div>
                    <Checkbox name='direction_read' value={props.register.direction.includes("R")} onChange={handleChange} label="Read"/>
                    <Checkbox name='direction_write' value={props.register.direction.includes("W")} onChange={handleChange} label="Write"/>
                </div>
            </ChoicesWrapper>
            {
                props.register.fields.map((field)=>{
                    return(
                        <FieldProperties
                            key={field.name}
                            peripheral={props.peripheral}
                            forceUpdate={props.forceUpdate}
                            register={props.register}
                            field={field}
                            parametric={props.register.parametric}
                        />
                    )
                })
            }
        </Card>
    );
};