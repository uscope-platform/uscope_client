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
import {Switch} from "./Switch.js";

interface CheckboxProps {
    name: string;
    label: string;
    value: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    style?: React.CSSProperties;
}

/// An on/off setting, shown as a switch. The handlers are the ones of a checkbox, so they get the name and the state in `target`.
export let  Checkbox = (props: CheckboxProps) =>{

    return(
        <div style={{padding: "0.3em 0"}}>
            <Switch
                name={props.name}
                label={props.label}
                value={props.value}
                style={props.style}
                onClick={({name, checked}) => props.onChange({target: {name, checked}} as React.ChangeEvent<HTMLInputElement>)}
            />
        </div>
    );
};
