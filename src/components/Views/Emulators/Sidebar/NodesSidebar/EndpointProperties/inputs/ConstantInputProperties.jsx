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

import React from 'react';
import {InputField} from "@UI";

export let ConstantInputProperties = props =>{

    let handle_change_iom = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.target.name;
            let value = event.target.value;

            value = value.replace(/\s/g, '');
            if(value.includes(",")){
                let value_tokens = value.split(",")
                value = value_tokens.map(val =>{
                    return parseFloat(val);
                })
            } else {
                value = parseFloat(value);
            }

            props.onChange(field, value);
        }
    };


    return(
        <InputField
            Inline
            key={"constant_value" + String(props.input.value[props.channel])}
            id="constant_value"
            name="value"
            label="Value"
            defaultValue={props.input.value[props.channel]}
            onKeyDown={handle_change_iom}
        />
    )
};
