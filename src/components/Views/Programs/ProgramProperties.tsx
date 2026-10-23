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

import {FieldPane, SelectField} from "#UI/index.js";
import {up_program} from "#client_core/index.js";

const PROGRAM_TYPES = [
    {label: "asm", value: "asm"},
    {label: "C", value: "C"},
    {label: "H", value: "H"}
];

interface ProgramPropertiesProps {
    program: up_program;
}

/// The properties of the selected program
let ProgramProperties = (props: ProgramPropertiesProps) =>{

    let handle_type_change = (option: {label: string, value: string} | null) =>{
        if(option === null) return;
        props.program.edit_field("type", option.value).then();
    };

    return(
        <FieldPane>
            <SelectField
                stacked
                label="Program type"
                onChange={handle_type_change}
                value={{label: props.program.type, value: props.program.type}}
                name="type"
                options={PROGRAM_TYPES}/>
        </FieldPane>
    );
};

export default ProgramProperties;
