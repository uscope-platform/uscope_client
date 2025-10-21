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
    InputField,
    Card,
    Checkbox,
    SelectField
} from "#UI/index.js";

import {up_application, up_filter, up_peripheral} from "#client_core/index.js";
import type {filter, peripheral_instance} from "#interfaces/index.js";
import type {ActionMeta} from "react-select";

interface FilterPropertiesProps{
    application: up_application,
    filter: filter,
    forceUpdate: ()=>void,
    peripherals: peripheral_instance[],
    filter_designs: Record<number, up_filter>
}

interface FilterSelectOption {
    label: string;
    value: string;
}

export let  FilterProperties = (props: FilterPropertiesProps) =>{

    let peripherals = props.peripherals.filter((periph_id) =>{
        return up_peripheral.get_filter_peripherals().includes(periph_id.spec_id);
    }).map((periph_id)=>{
        return {label:periph_id.name, value:periph_id.name};
    });


    let filter_designs = Object.keys(props.filter_designs).map((design_id)=>{
        let design = props.filter_designs[parseInt(design_id)];
        if(design === undefined) return {label:"", value:""};
        return {label:design.name, value:design.name};
    });


    let init_peripheral_value: FilterSelectOption = props.filter.peripheral ? {label:props.filter.peripheral, value:props.filter.peripheral} : {label:"", value:""};
    const [selected_periph, set_selected_periph] = useState(init_peripheral_value);

    let init_design_value: FilterSelectOption = props.filter.filter_name ? {label:props.filter.filter_name, value:props.filter.filter_name} : {label:"", value:""};
    const [selected_design, set_selected_design] = useState(init_design_value);


    let handleonKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            await props.application.edit_filter(props.filter.id, event.currentTarget.name, event.currentTarget.value);
            props.forceUpdate();
        }
    }

    let handleRemove= async () =>{

        await props.application.remove_filter(props.filter.id);
        props.forceUpdate();
    }
    let handleEnable = async (event: React.ChangeEvent<HTMLInputElement>)=>{
        await props.application.edit_filter(props.filter.id, event.target.name, event.target.checked);
        props.forceUpdate();
    }

    let handleHardwareChange = async (change: FilterSelectOption | null, event: ActionMeta<FilterSelectOption>)=>{
        if(change=== null) return;
        set_selected_periph(change);
        await props.application.edit_filter(props.filter.id,"peripheral", change.value);
        props.forceUpdate();
    }
    let handleTapsChange = async (change: FilterSelectOption | null, event: ActionMeta<FilterSelectOption>)=>{
        if(change=== null) return;
        set_selected_design(change);
        await props.application.edit_filter(props.filter.id,"filter_name", change.value);
        props.forceUpdate();
    }

    return(
        <Card
            name={props.filter.id.toString()}
            onRemove={handleRemove}
        >
            <InputField inline id='id' name='id' onKeyDown={handleonKeyDown} label="ID"/>

            <SelectField<FilterSelectOption>
                label="Filter Hardware"
                onChange={handleHardwareChange}
                value={selected_periph}
                name="peripheral"
                options={peripherals}/>
            <SelectField<FilterSelectOption>
                label="Filter Design"
                onChange={handleTapsChange}
                value={selected_design}
                name="filter_name"
                options={filter_designs}/>
            <Checkbox name='enabled' value={props.filter.enabled} onChange={handleEnable} label="Enabled"/>
        </Card>
    );
};
