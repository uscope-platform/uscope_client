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
} from "@UI";

import {up_application, up_peripheral} from "#client_core";

export let  FilterProperties = props =>{

    let peripherals = Object.keys(props.peripherals).filter((periph_id) =>{
        return up_peripheral.get_filter_peripherals().includes(props.peripherals[periph_id].spec_id);
    }).map((periph_id)=>{
        return {label:props.peripherals[periph_id].name, value:props.peripherals[periph_id].name};
    });


    let filter_designs = Object.keys(props.filter_designs).map((design_id)=>{
        return {label:props.filter_designs[design_id].name, value:props.filter_designs[design_id].name};
    });


    let init_peripheral_value = props.filter.peripheral ? {label:props.filter.peripheral, value:props.filter.peripheral} : undefined;
    const [selected_periph, set_selected_periph] = useState(init_peripheral_value);

    let init_design_value = props.filter.filter_name ? {label:props.filter.filter_name, value:props.filter.filter_name} : undefined;
    const [selected_design, set_selected_design] = useState(init_design_value);


    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let app = new up_application(props.application);
            app.edit_filter(props.filter.id, event.target.name, event.target.value).then(()=>{
                props.forceUpdate();
            });
        }
    }

    let handleRemove= (event) =>{
        let app = new up_application(props.application);
        app.remove_filter(props.filter.id).then(()=>{
            props.forceUpdate();
        });
    }
    let handleEnable = (event)=>{
        let app = new up_application(props.application);
        app.edit_filter(props.filter.id, event.target.name, event.target.checked).then(()=>{
            props.forceUpdate();
        });
    }

    let handleHardwareChange = (event)=>{
        set_selected_periph(event);
        let app = new up_application(props.application);
        app.edit_filter(props.filter.id,"peripheral", event.value).then(()=>{
            props.forceUpdate();
        });
    }
    let handleTapsChange = (event)=>{
        set_selected_design(event);
        let app = new up_application(props.application);
        app.edit_filter(props.filter.id,"filter_name", event.value).then(()=>{
            props.forceUpdate();
        });
    }

    return(
        <Card
            name={props.filter.id}
            onRemove={handleRemove}
        >
            <InputField inline id='id' name='id' defaultValue={props.filter.id} onKeyDown={handleonKeyDown} label="ID"/>

            <SelectField
                label="Filter Hardware"
                onChange={handleHardwareChange}
                value={selected_periph}
                defaultValue="Select Filter Hardware"
                name="peripheral"
                placeholder="Filter Hardware"
                options={peripherals}/>
            <SelectField
                label="Filter Design"
                onChange={handleTapsChange}
                value={selected_design}
                defaultValue="Select Filter Design"
                name="filter_name"
                placeholder="Filter Design"
                options={filter_designs}/>
            <Checkbox id="enabled" name='enabled' value={props.filter.enabled} onChange={handleEnable} label="Enabled"/>
        </Card>
    );
};
