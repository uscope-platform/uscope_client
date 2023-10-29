// Copyright 2023 Filippo Savi
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

import React, {useReducer} from 'react';

import {Responsive, WidthProvider} from "react-grid-layout";
import {InputField, SelectField, SimpleContent, UIPanel} from "../../../UI_elements";
import {useDispatch, useSelector} from "react-redux";
import {MdAdd} from "react-icons/md";
import {up_emulator} from "../../../../client_core";
import {setSetting} from "../../../../redux/Actions/SettingsActions";
import NodeIomProperties from "./NodeIomProperties";

let  EmulatorCoreProperties = props =>{

    const settings = useSelector(state => state.settings);


    let handle_change = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;
            if(field === "program"){
                let comps = event.target.value.split(".");
                value = {filename: event.target.value, type:comps[1]}
            }
            if(field === "order" || field === "channels") value = parseInt(value);
            if(field==="efi_implementation"||field==="comparators"){
                value = props.selected_core.options;
                value[field] = event.target.value;
                field = "options";
            }
            props.selected_emulator.edit_core_props(settings.emulator_selected_component.obj.id, field, value).then();
        }
    }


    return(
        <div key="node_props">
            <InputField inline ID="name" name="name" label="Core Name" defaultValue={props.selected_core.name} onKeyDown={handle_change}/>
            <InputField inline ID="channels" name="channels" label="Channels #" defaultValue={props.selected_core.channels} onKeyDown={handle_change}/>
            <InputField inline ID="program" name="program" label="Program" defaultValue={props.selected_core.program.filename} onKeyDown={handle_change}/>
            <InputField inline ID="input_file" name="input_file" label="Input File" defaultValue={props.selected_core.input_file} onKeyDown={handle_change}/>
            <InputField inline ID="order" name="order" label="Execution Order" defaultValue={props.selected_core.order} onKeyDown={handle_change}/>
            <InputField inline ID="efi_implementation" name="efi_implementation" label="EFI" defaultValue={props.selected_core.options.efi_implementation} onKeyDown={handle_change}/>
            <InputField inline ID="comparators" name="comparators" label="comparators" defaultValue={props.selected_core.options.comparators} onKeyDown={handle_change}/>
        </div>
    );
};

export default EmulatorCoreProperties;
