// Copyright 2021 University of Nottingham Ningbo China
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

import React from "react";

import {InputField} from "../InputField";
import {up_script} from "../../../client_core/data_models/up_script";

export let  ScriptProperties = props =>{


    let handleonKeyDown = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab"){
            let scr = new up_script(props.script);
            scr.edit_field(event.target.name, event.target.value);
        }
    }

    return(
        <InputField inline name={props.field_name} placeholder={props.field_value} onKeyDown={handleonKeyDown} label={props.field_name}/>
    );
};