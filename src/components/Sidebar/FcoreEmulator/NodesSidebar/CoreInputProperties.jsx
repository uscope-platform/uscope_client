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

let  CoreInputProperties = props =>{

    const settings = useSelector(state => state.settings);

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const dispatch = useDispatch();


    let handle_change_iom = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            if(field === "reg_n" || field === "channel") value = parseInt(value);

            props.selected_emulator.edit_input(settings.emulator_selected_component.obj.id,
                field, value, settings.emulator_selected_iom.obj).then(()=>{
                if(field === 'name'){
                    dispatch(setSetting(["emulator_selected_iom", {type:settings.emulator_selected_iom.type, obj:value}]));
                }
                forceUpdate();
            });
        }
    };

    let handle_select = (obj, e) =>{
        props.selected_emulator.edit_input(settings.emulator_selected_component.obj.id,
            e.name, obj.value, settings.emulator_selected_iom.obj).then(()=>{
            forceUpdate();
        });
    }


    let sel_in = props.selected_core.inputs.filter((item)=>{
        return item.name === settings.emulator_selected_iom.obj
    })[0];

    let render_vector_input_properties = () =>{
        if(sel_in.register_type==="vector" || sel_in.register_type==="explicit_vector"){
            return <InputField ID="labels" name="labels" label="Labels" defaultValue={sel_in.labels} onKeyDown={handle_change_iom}/>
        }
    }

    return(
        <SimpleContent name="Input Properties" content={
            <div key="input_props">
                <InputField ID="name" name="name" label="Name" defaultValue={sel_in.name} onKeyDown={handle_change_iom}/>
                <InputField ID="channel" name="channel" label="Channel" defaultValue={sel_in.channel} onKeyDown={handle_change_iom}/>
                <InputField ID="reg_n" name="reg_n" label="Register #" defaultValue={sel_in.reg_n} onKeyDown={handle_change_iom}/>
                <SelectField
                    inline
                    label="Data Type"
                    onChange={handle_select}
                    value={{value: sel_in.type, label: sel_in.type}}
                    defaultValue="Select Data Type"
                    name="type"
                    options={[
                        {label: "float", value: "float"},
                        {label: "integer", value: "integer"}
                    ]}
                />
                <SelectField
                    inline
                    label="Register Type"
                    onChange={handle_select}
                    value={{value: sel_in.register_type, label: sel_in.register_type}}
                    defaultValue="Select Register Type"
                    name="register_type"
                    options={[
                        {label: "scalar", value: "scalar"},
                        {label: "vector", value: "vector"},
                        {label: "explicit_vector", value: "explicit_vector"}
                    ]}
                />
                {render_vector_input_properties()}
            </div>
        }/>
    )

};

export default CoreInputProperties;