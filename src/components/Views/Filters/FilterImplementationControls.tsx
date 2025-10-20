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

import {InputField} from "#UI/index.js";

interface FilterImplementationControls{
    filter_parameters: Record<string, any>,
    on_change: (name: string, value: number) => void,
}

let  FilterImplementationControls = (props: FilterImplementationControls) =>{

    let handle_edit_field = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key==="Enter"|| event.key ==="Tab"){
            props.on_change(event.currentTarget.name, parseFloat(event.currentTarget.value));
        }
    }



    let render_controls = () =>{
        let ret = []

        ret.push(<InputField key="taps_width" inline name="taps_width" defaultValue={props.filter_parameters.taps_width} onKeyDown={handle_edit_field} label="Width of the filter taps"/>);

        return ret;
    }

    return render_controls();
};

export default FilterImplementationControls;
