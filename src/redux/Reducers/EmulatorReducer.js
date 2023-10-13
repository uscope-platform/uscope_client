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

import {ADD_EMULATOR, REMOVE_EMULATOR, LOAD_ALL_EMULATOR} from "../Actions/types";

let emulatorsReducer = function (state = [], action) {
    switch (action.type) {
        case ADD_EMULATOR:
            return {...state, ...{[action.payload.id]:action.payload}}
        case REMOVE_EMULATOR:
            return  Object.keys(state)
                .filter(key => {
                    return key !== action.payload.id.toString();
                })
                .reduce((obj, key) => {
                    obj[key] = state[key];
                    return obj;
                }, {});
        case LOAD_ALL_EMULATOR:
            state = action.payload;
            return state;
        default:
            return state;
    }
};

export default emulatorsReducer;