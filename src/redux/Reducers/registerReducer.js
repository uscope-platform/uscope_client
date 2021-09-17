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

import {LOAD_REGISTERS, SEND_REGISTER} from "../Actions/types";
import produce from "immer";

let registerValuesReducer = function (state = {}, action) {
    switch (action.type) {
        case LOAD_REGISTERS:
            return produce(state, draftState => {
                draftState[action.payload.peripheral] = action.payload.value;
            });
        case SEND_REGISTER:
            return produce(state, draftState => {
                if (!(action.payload.peripheral in draftState)){
                    draftState[action.payload.peripheral] = {};
                }
                draftState[action.payload.peripheral][action.payload.name] = action.payload.value;
            });
        default:
            return state;
    }
};

export default registerValuesReducer;
