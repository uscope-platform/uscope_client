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

import {ADD_PERIPHERAL, LOAD_PERIPHERALS, REMOVE_PERIPHERAL} from "../Actions/types";

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
                    return key !== action.payload;
                })
                .reduce((obj, key) => {
                    obj[key] = state[key];
                    return obj;
                }, {});
        default:
            return state;
    }
};

export default PeripheralsReducer;
