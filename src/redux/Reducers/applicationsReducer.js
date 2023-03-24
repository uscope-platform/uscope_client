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
    ADD_APPLICATION,
    LOAD_APPLICATIONS,
    REMOVE_APPLICATION,
    SAVE_PARAMETER
} from "../Actions/types";
import produce from "immer";


let ApplicationsReducer = function (state = [], action) {
    switch (action.type) {
        case SAVE_PARAMETER:
            return produce(state, draftState =>{
                let target = draftState[action.payload.app]["parameters"].filter((item)=>{
                    return item['parameter_id'] === action.payload.name;
                })[0];
                target.value = action.payload.value;
            });
        case LOAD_APPLICATIONS:
            state = action.payload;
            return state;
        case REMOVE_APPLICATION:
            return  Object.keys(state)
                .filter(key => {
                    return key !== action.payload;
                })
                .reduce((obj, key) => {
                    obj[key] = state[key];
                    return obj;
                }, {});
        case ADD_APPLICATION:
            return {...state, ...action.payload}
        default:
            return state;
    }
};

export default ApplicationsReducer;
