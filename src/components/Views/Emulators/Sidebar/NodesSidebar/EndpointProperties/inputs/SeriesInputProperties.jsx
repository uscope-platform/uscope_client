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
import {SelectField} from "@UI";

export let SeriesInputProperties = props =>{

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let files = props.selected_core.input_data.map((item)=>{
        return Object.keys(item.data).map((name)=>{
            let label = name.split("[")[0];
            return {label:item.name + "." + label, value:item.name + "." + label};
        })
    }).flat();


    let handle_select = (obj, e) =>{
        let field = e.name;
        let value = obj.value;
        if(e.name === "source_type"){
            field = "source"
            value = {...props.input, ...{"type":value}};
        }
        if(field === "source_value") {
            field = "source";
            value = {...props.input, ...{"value":value}};
        }
        props.selected_emulator.edit_input(props.selected_component.obj.id,
            field, value, props.selected_iom.obj).then(()=>{
            forceUpdate();
        });
    }

    return(
        <SelectField
            inline
            key="source_value"
            label="Data Series"
            onChange={handle_select}
            value={{value: props.input.value, label: props.input.value}}
            defaultValue="Select data series"
            name="source_value"
            options={files}
        />
    )


};

export default SeriesInputProperties;
