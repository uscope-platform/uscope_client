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

import React from 'react';

import {Button} from "../UI_elements"
import styled from "styled-components";

import {run_script, up_peripheral} from "../../client_core";

import store from "../../store";


const ButtonGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-items: center;
    gap: 1em;
`

let  MacroActions = props =>{

    let onClick = (event) => {
        let trigger_str = event.target.name;
        let bulk_registers = run_script(store, trigger_str, props.parameters, "");
        if(bulk_registers !== null){
            up_peripheral.bulk_register_write({payload: bulk_registers}).then();
        }
    };

    return(
        <ButtonGrid>
            {props.macro.map((macro) => {
                return(
                    <div key={macro.name} style={{margin:'0.5rem'}}>
                        <Button key={macro.name} className="macro_action_buttons" name={macro.trigger} onClick={onClick}>{macro.name}</Button>
                    </div>
                );
            })}
        </ButtonGrid>
    );
};

export default MacroActions;