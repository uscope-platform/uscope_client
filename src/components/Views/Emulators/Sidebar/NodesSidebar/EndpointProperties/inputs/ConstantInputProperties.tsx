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
import {InputField} from "#UI/index.js" ;
import type {core_input_source} from "#interfaces/index.js";

interface ConstantInputPropertiesProps {
    input: core_input_source,
    channel: number,
    onChange: (field: string, value: number | number[]) => void,
}

export let ConstantInputProperties = (props: ConstantInputPropertiesProps) =>{

    let handle_change_iom = (event: React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let field = event.currentTarget.name;


            let raw_val = event.currentTarget.value.replace(/\s/g, '');
            if(raw_val.includes(",")){
                let value = raw_val.split(",").map(val =>{
                    return parseFloat(val);
                })
                props.onChange(field, value);
            } else {
                props.onChange(field, parseFloat(raw_val));
            }

        }
    };


    return(
        <InputField
            key={"constant_value" + String(props.input.value[props.channel])}
            id="constant_value"
            name="value"
            label="Value"
            defaultValue={props.input.value[props.channel]}
            onKeyDown={handle_change_iom}
        />
    )
};
