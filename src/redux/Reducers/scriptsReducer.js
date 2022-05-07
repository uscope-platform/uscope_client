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

import {ADD_SCRIPT, LOAD_ALL_SCRIPTS, REMOVE_SCRIPT, SAVE_SCRIPT_WORKSPACE} from "../Actions/types";


let scriptsReducer = function (state = [], action) {
    switch (action.type) {
        case ADD_SCRIPT:
            return {...state, ...{[action.payload.id]:action.payload}}
        case REMOVE_SCRIPT:
            return  Object.keys(state)
                .filter(key => {
                    return key !== action.payload.id.toString();
                })
                .reduce((obj, key) => {
                    obj[key] = state[key];
                    return obj;
                }, {});
        case LOAD_ALL_SCRIPTS:
            state = action.payload;
            return  state;
        default:
            return state;
    }
};


let scriptsWorkspaceReducer = function(state=null, action) {
    switch (action.type) {
        case SAVE_SCRIPT_WORKSPACE:
            state = {...state, ...action.payload};
            return state;
        default:
            return state;
    }
};


export  {scriptsReducer, scriptsWorkspaceReducer};
