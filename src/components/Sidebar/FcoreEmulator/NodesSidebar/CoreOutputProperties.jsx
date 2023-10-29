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

import {InputField, SelectField, SimpleContent} from "../../../UI_elements";
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../../../../redux/Actions/SettingsActions";

let  CoreOutputProperties = props =>{

    const settings = useSelector(state => state.settings);

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const dispatch = useDispatch();


    let handle_change_iom = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            if(field === "reg_n" || field === "channel") value = parseInt(value);

            props.selected_emulator.edit_output(settings.emulator_selected_component.obj.id,
                field, value, settings.emulator_selected_iom.obj).then(()=>{
                if(field === 'name'){

                    dispatch(setSetting(["emulator_selected_iom", {type:settings.emulator_selected_iom.type, obj:value}]));
                }
                forceUpdate();
            });
        }
    };

    let handle_change_type = (event) =>{
        props.selected_emulator.edit_output(settings.emulator_selected_component.obj.id,
            "type", event.value, settings.emulator_selected_iom.obj).then(()=>{
            forceUpdate();
        });
    }

    let sel_out = props.selected_core.outputs.filter((item)=>{
        return item.name === settings.emulator_selected_iom.obj
    })[0];

    return(
        <SimpleContent name="Output Properties" content={
            <div key="output_props">
                <InputField inline ID="name" name="name" label="Name" defaultValue={sel_out.name} onKeyDown={handle_change_iom}/>
                <InputField inline ID="reg_n" name="reg_n" label="Register #" defaultValue={sel_out.reg_n} onKeyDown={handle_change_iom}/>
                <SelectField
                    inline
                    label="Type"
                    onChange={handle_change_type}
                    value={{value: sel_out.type, label: sel_out.type}}
                    defaultValue="Select Type"
                    name="type"
                    options={[
                        {label: "float", value: "float"},
                        {label: "integer", value: "integer"}
                    ]}
                />
            </div> }/>
    )

};

export default CoreOutputProperties;
