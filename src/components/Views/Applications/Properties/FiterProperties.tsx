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
import {
    Card,
    FormLayout,
    SelectField
} from "#UI/index.js";

import {up_application, up_filter, up_peripheral} from "#client_core/index.js";
import type {filter, peripheral_instance, SimpleStringOption} from "#interfaces/index.js";

interface FilterPropertiesProps{
    application: up_application,
    filter: filter,
    forceUpdate: ()=>void,
    peripherals: peripheral_instance[],
    filter_designs: Record<number, up_filter>
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


    // what the application has, not a copy of it: it changes when the filter is edited from elsewhere
    const selected_periph: SimpleStringOption = {label: props.filter.peripheral, value: props.filter.peripheral};
    const selected_design: SimpleStringOption = {label: props.filter.filter_name, value: props.filter.filter_name};

    let handleEnable = async (target: {name: string, checked: boolean})=>{
        await props.application.edit_filter(props.filter.id, target.name, target.checked);
        props.forceUpdate();
    }

    let handleHardwareChange = async (change: SimpleStringOption | null)=>{
        if(change=== null) return;
        await props.application.edit_filter(props.filter.id,"peripheral", change.value);
        props.forceUpdate();
    }
    let handleTapsChange = async (change: SimpleStringOption | null)=>{
        if(change=== null) return;
        await props.application.edit_filter(props.filter.id,"filter_name", change.value);
        props.forceUpdate();
    }

    return(
        <Card
            style={{width: "100%", paddingLeft: 0}}
            selector={{
                name:"enabled",
                label:"Enabled",
                click:handleEnable,
                value:props.filter.enabled
            }}
        >
            <FormLayout columns="10.5rem">
                <SelectField<SimpleStringOption>
                    stacked
                    label="Filter Hardware"
                    onChange={handleHardwareChange}
                    value={selected_periph}
                    name="peripheral"
                    options={peripherals}/>
                <SelectField<SimpleStringOption>
                    stacked
                    label="Filter Design"
                    onChange={handleTapsChange}
                    value={selected_design}
                    name="filter_name"
                    options={filter_designs}/>
            </FormLayout>
        </Card>
    );
};
