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

import {ADD_PERIPHERAL, EDIT_PERIPHERAL, LOAD_PERIPHERALS, REMOVE_PERIPHERAL} from "../Actions/types";
import produce from "immer";


let PeripheralsReducer = function (state = null, action) {
    switch (action.type) {
        case LOAD_PERIPHERALS:
            state = action.payload;
            return state;

        case EDIT_PERIPHERAL:
            switch (action.payload.action) {
                case "edit_register":
                    return produce(state, draftState => {
                        let reg = draftState[action.payload.peripheral]["registers"].filter((item)=>{
                            return item.register_name===action.payload.register;
                        })[0];
                        reg[action.payload.field] = action.payload.value;
                        return draftState
                    });
                case "add_register":
                    return produce(state, draftState => {
                        draftState[action.payload.peripheral]["registers"].push(action.payload.register)
                        return draftState
                    });
                case "remove_register":
                    return produce(state, draftState => {
                        draftState[action.payload.peripheral]["registers"] = draftState[action.payload.peripheral]["registers"].filter((item) => {
                            return item.register_name !== action.payload.register;
                        });
                        return draftState
                    });
                case "change_image":
                    return produce(state, draftState => {
                        let periph = draftState[action.payload.peripheral]
                        let image_path = periph.image.substring(0, periph.image.lastIndexOf("/"));
                        periph.image = image_path+"/"+action.payload.path;
                        return draftState
                    });
                case "edit_version":
                    return produce(state, draftState => {
                        draftState[action.payload.peripheral]["version"] = action.payload.version;
                        return draftState
                    });
                default:
                    return state;

            }

        case REMOVE_PERIPHERAL:
            return produce(state, draftState => {
                delete draftState[action.payload];
            });

        case ADD_PERIPHERAL:
            return {...state, ...action.payload.payload}
        default:
            return state;
    }
};

export default PeripheralsReducer;
