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

let  CoreOutputProperties = props =>{


    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let sel_out = props.selected_core.outputs.filter((item)=>{
        return item.name === props.selected_iom.obj
    })[0];


    let handle_change_iom = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            if(field === "reg_n" || field === "channel") {
                if(field === "reg_n" &&  sel_out.register_type === "vector"){
                    value = value.split(",").map((item) =>{
                        return parseInt(item.trim());
                    });
                } else {
                    value = parseInt(value);
                }
            }

            props.selected_emulator.edit_output(props.selected_component.obj.id,
                field, value, props.selected_iom.obj).then(()=>{
                if(field === 'name'){
                    props.on_modify({type:props.selected_iom.type, obj:value});
                }
                forceUpdate();
            });
        }
    };

    let handle_select = (object, e) =>{
        props.selected_emulator.edit_output(props.selected_component.obj.id,
            e.name, object.value, props.selected_iom.obj).then(()=>{
            forceUpdate();
        });
    }


    return(
        <SimpleContent name="Output Properties" content={
            <div key="output_props">
                <InputField inline ID="name" name="name" label="Name" defaultValue={sel_out.name} onKeyDown={handle_change_iom}/>
                <InputField inline ID="reg_n" name="reg_n" label="Register #" defaultValue={sel_out.reg_n} onKeyDown={handle_change_iom}/>
                <SelectField
                    inline
                    label="Type"
                    onChange={handle_select}
                    value={{value: sel_out.type, label: sel_out.type}}
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
                    value={{value: sel_out.register_type, label: sel_out.register_type}}
                    defaultValue="Select Register Type"
                    name="register_type"
                    options={[
                        {label: "scalar", value: "scalar"},
                        {label: "vector", value: "vector"}
                    ]}
                />
            </div> }/>
    )

};

export default CoreOutputProperties;
