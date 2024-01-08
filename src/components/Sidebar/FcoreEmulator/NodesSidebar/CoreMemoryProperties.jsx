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

import {Checkbox, InputField, SelectField, SimpleContent} from "../../../UI_elements";
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../../../../redux/Actions/SettingsActions";
import {up_application} from "../../../../client_core";

let  CoreMemoryProperties = props =>{

    const settings = useSelector(state => state.settings);

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const dispatch = useDispatch();

    let handle_change_output = (event)=>{

        let field = event.target.name;
        let value = event.target.checked;
        props.selected_emulator.edit_memory(settings.emulator_selected_component.obj.id,
            field, value, settings.emulator_selected_iom.obj).then(()=>{
            forceUpdate();
        });
    }

    let handle_change_iom = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            if(field === "reg_n" || field === "channel"|| field==="vector_size") value = parseInt(value);

            props.selected_emulator.edit_memory(settings.emulator_selected_component.obj.id,
                field, value, settings.emulator_selected_iom.obj).then(()=>{
                if(field === 'name'){
                    dispatch(setSetting(["emulator_selected_iom", {type:settings.emulator_selected_iom.type, obj:value}]));
                }
                forceUpdate();
            });
        }
    };

    let handle_change_type = (event) =>{
        props.selected_emulator.edit_memory(settings.emulator_selected_component.obj.id,
            "type", event.value, settings.emulator_selected_iom.obj).then(()=>{
            forceUpdate();
        });
    }

    let sel_mem = props.selected_core.memory_init.filter((item)=>{
        return item.name === settings.emulator_selected_iom.obj
    })[0];


    let handle_select = (selection, event) =>{
        props.selected_emulator.edit_memory(settings.emulator_selected_component.obj.id,
            event.name, selection.value, settings.emulator_selected_iom.obj).then(()=>{
            forceUpdate();
        });
    }

    let render_vector_init_props = () =>{
        if(sel_mem.register_type === "vector"){
            return(<InputField inline key="vector_size" ID="vector_size" name="vector_size" label="Vector size" defaultValue={sel_mem.vector_size} onKeyDown={handle_change_iom}/>);
        }
    }

    return(
        <SimpleContent name="Memory Properties" content={
            <div key="memory_props">
                <InputField inline ID="name" name="name" label="Name" defaultValue={sel_mem.name} onKeyDown={handle_change_iom}/>
                <InputField inline ID="reg_n" name="reg_n" label="Register #" defaultValue={sel_mem.reg_n} onKeyDown={handle_change_iom}/>
                <SelectField
                    inline
                    label="Type"
                    onChange={handle_change_type}
                    value={{value: sel_mem.type, label: sel_mem.type}}
                    defaultValue="Select Type"
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
                    value={{value: sel_mem.register_type, label: sel_mem.register_type}}
                    defaultValue="Select Register Type"
                    name="register_type"
                    options={[
                        {label: "scalar", value: "scalar"},
                        {label: "vector", value: "vector"}
                    ]}
                />
                {render_vector_init_props()}
                <InputField inline ID="value" name="value" label="Value" defaultValue={sel_mem.value} onKeyDown={handle_change_iom}/>
                <Checkbox name='is_output' value={sel_mem.is_output} onChange={handle_change_output} label="Use as Output"/>
            </div>
        }/>
    )

};

export default CoreMemoryProperties;
