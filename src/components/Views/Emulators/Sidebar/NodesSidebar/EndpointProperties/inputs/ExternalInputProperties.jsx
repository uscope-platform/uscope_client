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
import {InputField} from "@UI";

export let ExternalInputProperties = props =>{

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let handle_change_iom = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            field = "source";
            if(props.input.type === "constant" || props.input.type === "external") {
                value = value.replace(/\s/g, '');
                let value_tokens = value.split(",")
                value = value_tokens.map(val =>{
                    return parseFloat(val);
                })
            }
            value = {...props.input, ...{"value":value}};

            props.selected_emulator.edit_input(props.selected_component.obj.id,
                field, value, props.selected_iom.obj).then(()=>{
                if(field === 'name'){
                    props.on_modify({type:props.selected_iom.type, obj:value});
                }
                forceUpdate();
            });
        }
    };


    return(
        <InputField
            Inline
            key={"initial_value" + String(props.input.value)}
            id="initial_value"
            name="initial_value"
            label="Initial Value"
            defaultValue={props.input.value}
            onKeyDown={handle_change_iom}
        />
    )


};

export default ExternalInputProperties;
