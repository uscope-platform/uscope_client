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
import {SelectField} from "#UI/index.js";
import type {core, core_input_source, SimpleStringOption} from "#interfaces/index.js";
import type {ActionMeta} from "react-select";

interface SeriesInputPropertiesProps {
    input: core_input_source,
    selected_core: core,
    channel: number,
    onChange: (field: string, value: string) => void,
}

export let SeriesInputProperties = (props:SeriesInputPropertiesProps) =>{

    let files = props.selected_core.input_data.map((item)=>{
        return Object.keys(item.data).map((name)=>{
            let label = name.split("[")[0];
            return {label:item.name + "." + label, value:item.name + "." + label};
        })
    }).flat();


    let handle_select = (obj: SimpleStringOption | null, e: ActionMeta<SimpleStringOption>) =>{
        let field = e.name;
        if(!obj || field == undefined) return;
        let value = obj.value;
        props.onChange(field, value);
    }

    return(
        <SelectField<SimpleStringOption>
            key="source_value"
            label="Data Series"
            onChange={handle_select}
            value={{value: props.input.value, label: props.input.value}}
            name="value"
            options={files}
        />
    )


};
