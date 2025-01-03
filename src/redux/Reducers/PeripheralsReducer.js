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

import {
    ADD_PERIPHERAL,
    LOAD_PERIPHERALS, REMOVE_FIELD,
    REMOVE_PERIPHERAL,
    REMOVE_REGISTER,
    UPSERT_FIELD,
    UPSERT_REGISTER
} from "../Actions/types";

let PeripheralsReducer = function (state = null, action) {
    switch (action.type) {
        case LOAD_PERIPHERALS:
            state = action.payload;
            return state;
        case ADD_PERIPHERAL:
            return {...state, ...action.payload.payload}
        case REMOVE_PERIPHERAL:
            return  Object.keys(state)
                .filter(key => {
                    return parseInt(key) !== action.payload;
                })
                .reduce((obj, key) => {
                    obj[key] = state[key];
                    return obj;
                }, {});
        case UPSERT_REGISTER:
            Object.keys(state).map((key=>{
                state[action.parent].registers = state[action.parent].registers.map((reg) =>{
                    if(reg.ID === action.register_id)
                        return action.payload;
                    else
                        return reg;
                });
                return [];
            }))
            return state;
        case UPSERT_FIELD:
                state[action.parent_periph].registers = state[action.parent_periph].registers.map((reg) =>{
                if(reg.register_name === action.parent_reg) {
                    reg.fields = reg.fields.map((f) => {
                        if (f.name === action.field_id) {
                            return action.payload;
                        } else
                            return f;
                    })
                }
                return reg;
            });
            return state;
        case REMOVE_REGISTER:
            Object.keys(state).map((key=>{
                state[action.payload.periph].registers = state[action.payload.periph].registers.filter((reg) =>{
                    return reg.ID !== action.payload.reg;
                });
                return [];
            }))
            return state;
        case REMOVE_FIELD:
            state[action.payload.periph].registers = state[action.payload.periph].registers.map((reg) =>{
                if(reg.ID === action.payload.reg) {
                    reg.fields = reg.fields.filter((f) => {
                        return f.name !== action.payload.field
                    })
                }
                return reg;
            });
            return state;
        default:
            return state;
    }
};

export default PeripheralsReducer;
