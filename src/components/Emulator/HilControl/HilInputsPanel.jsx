
// Copyright 2024 Filippo Savi
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
import {InputField, SelectField} from "../../UI_elements";

let HilInputsPanel = function (props) {

    let target_inputs = props.emulator ? props.emulator.get_inputs() : {};

    let handle_input = (event) =>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let input = event.target.name;
            let value = parseFloat(event.target.value);
            // TODO: PUSH input change to driver
        }
    }

    let render_inputs= () =>{
        let ret =  [];
        target_inputs.map((ti)=>{
            ret.push(
                <InputField
                    inline
                    ID={ti.name}
                    name={ti.name}
                    key={ti.name}
                    label={ti.name}
                    defaultValue={ti.value}
                    onKeyDown={handle_input}
                />
            )
        })
        return ret;
    }


    return(
        <div>
            {render_inputs()}
        </div>
    );
};


export default HilInputsPanel;







