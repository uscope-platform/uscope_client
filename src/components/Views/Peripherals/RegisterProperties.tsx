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
import {Label, InputField, Checkbox, Card} from "#UI/index.js";
import {styled} from "goober";

import {FieldProperties} from "./FieldProperties.js";
import {up_register, up_peripheral} from "#client_core/index.js";

const ChoicesWrapper = styled('div')`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`

interface RegisterPropertyProps {
    register: up_register,
    peripheral: up_peripheral,
    forceUpdate: ()=>void
}

export let  RegisterProperties = (props: RegisterPropertyProps) =>{
    const register_obj = new up_register(props.register, props.peripheral.id);



    let handleEditNameChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key==="Enter"){
            register_obj.edit_name(event.currentTarget.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        register_obj.edit_direction(event.target).then(()=>{
            props.forceUpdate();
        });
    }

    let handleonKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            switch (event.currentTarget.name) {
                case "n_registers":
                    register_obj.edit_n_registers(event.currentTarget.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case "order":
                    register_obj.edit_order(parseInt(event.currentTarget.value)).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case "ID":
                    register_obj.edit_id(event.currentTarget.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case "description":
                    register_obj.edit_description(event.currentTarget.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                case "register_name":
                    register_obj.edit_name(event.currentTarget.value).then(()=>{
                        props.forceUpdate();
                    })
                    break;
                default:
                    return;
            }
        }

    }

    let handleRemove= () =>{
        up_register.remove_register(props.peripheral.id, props.register.ID).then(()=>{
            props.forceUpdate();
        });
    }



    return(
        <Card
            name={props.register.register_name}
            onRemove={handleRemove}
        >
            <InputField inline name="register_name" defaultValue={props.register.register_name} onKeyDown={handleEditNameChange} label="Name"/>
            <InputField inline name='ID' defaultValue={props.register.ID} onKeyDown={handleonKeyDown} label="Register ID"/>

            <div style={{display: "flex", flexDirection: "column"}}>
                <InputField inline name='order' defaultValue={props.register.order !==undefined ? props.register.order.toString(): ""} onKeyDown={handleonKeyDown} label="Order"/>
                <InputField inline name='n_registers' defaultValue={props.register.n_registers[0] ? props.register.n_registers[0]: ""} onKeyDown={handleonKeyDown} label="Number of Registers"/>
            </div>
            <InputField inline id="description" name='description' defaultValue={props.register.description} onKeyDown={handleonKeyDown} label="Description"/>
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
                        />
                    )
                })
            }
        </Card>
    );
};