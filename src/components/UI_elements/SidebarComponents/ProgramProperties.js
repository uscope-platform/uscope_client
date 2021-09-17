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

export let  ProgramProperties = props =>{


    let handleonKeyDown = (event) =>{
        let edit = {}
        if(event.key==="Enter"|| event.key ==="Tab"){
            edit = {program:props.program, field:event.target.name, value:event.target.value}
            props.server.prog_proxy.edit_program(edit);
        }
    }

    return(
        <InputField inline name={props.field_name} placeholder={props.field_value} onKeyDown={handleonKeyDown} label={props.field_name}/>
    );
};