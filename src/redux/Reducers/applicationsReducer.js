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
    EDIT_APPLICATION,
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
        case EDIT_APPLICATION:
            switch (action.payload.action) {
                case "add_channel_group":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["channel_groups"].push(action.payload.group);
                    });
                case "edit_channel_group":
                    return produce(state, draftState => {
                        let target = draftState[action.payload.application]["channel_groups"].filter((item)=>{
                            return item['group_name'] === action.payload.group;
                        })[0];
                        target[action.payload.field] = action.payload.value;
                    });
                case "remove_channel_group":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["channel_groups"] = draftState[action.payload.application]["channel_groups"].filter((item)=>{
                            return item['group_name'] !== action.payload.group;
                        });
                    });
                case "add_channel":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["channels"].push(action.payload.channel);
                    });
                case "edit_channel":
                    return produce(state, draftState => {
                        let target = draftState[action.payload.application]["channels"].filter((item)=>{
                            return item['name'] === action.payload.channel;
                        })[0];
                        target[action.payload.field] = action.payload.value;
                    });
                case "remove_channel":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["channels"] = draftState[action.payload.application]["channels"].filter((item)=>{
                            return item['name'] !== action.payload.channel;
                        });
                    });
                case "add_irv":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["initial_registers_values"].push(action.payload.irv);
                    });
                case "edit_irv":
                    return produce(state, draftState => {
                        let target = draftState[action.payload.application]["initial_registers_values"].filter((item)=>{
                            return item['address'] === action.payload.address;
                        })[0];
                        target[action.payload.field] = action.payload.value;
                    });
                case"remove_irv":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["initial_registers_values"] = draftState[action.payload.application]["initial_registers_values"].filter((item)=>{
                            return item['address'] !== action.payload.address;
                        });
                    });
                case "add_macro":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["macro"].push(action.payload.macro)
                    });
                case "edit_macro":
                    return produce(state, draftState => {
                        let target = draftState[action.payload.application]["macro"].filter((item)=>{
                            return item['name'] === action.payload.name;
                        })[0];
                        target[action.payload.field] = action.payload.value;
                    });
                case"remove_macro":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["macro"] = draftState[action.payload.application]["macro"].filter((item)=>{
                            return item['name'] !== action.payload.name;
                        });
                    });
                case "add_parameter":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["parameters"].push(action.payload.parameter);
                    });
                case "edit_parameter":
                    return produce(state, draftState => {
                        let target = draftState[action.payload.application]["parameters"].filter((item)=>{
                            return item['parameter_id'] === action.payload.parameter;
                        })[0];
                        target[action.payload.field] = action.payload.value;
                    });
                case"remove_parameter":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["parameters"] = draftState[action.payload.application]["parameters"].filter((item)=>{
                            return item['parameter_id'] !== action.payload.parameter;
                        });
                    });
                case "add_peripheral":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["peripherals"].push(action.payload.peripheral)
                    });
                case "edit_peripheral":
                    return produce(state, draftState => {
                        let target = draftState[action.payload.application]["peripherals"].filter((item)=>{
                            return item['name'] === action.payload.peripheral;
                        })[0];
                        target[action.payload.field] = action.payload.value;
                    });
                case"remove_peripheral":
                    return produce(state, draftState => {
                        draftState[action.payload.application]["peripherals"] = draftState[action.payload.application]["peripherals"].filter((item)=>{
                            return item['name'] !== action.payload.peripheral;
                        });
                    });
                case "add_misc":
                    return produce(state, draftState => {
                        draftState[action.payload.application][action.payload.field.name] = action.payload.field.value;
                    });
                case "edit_misc":
                    return produce(state, draftState => {
                        let value = 0;
                        if(action.payload.field.old_name)
                            value = draftState[action.payload.application][action.payload.field.old_name];
                        else
                            value = action.payload.field.value

                        delete draftState[action.payload.application][action.payload.field.old_name];
                        draftState[action.payload.application][action.payload.field.name] =value;
                    });
                case"remove_misc":
                    return produce(state, draftState => {
                        delete draftState[action.payload.application][action.payload.field.name];
                    });
                default:
                    return state;
            }
        case LOAD_APPLICATIONS:
            state = action.payload;
            return state;
        case REMOVE_APPLICATION:
            return produce(state, draftState => {
                delete draftState[action.payload];
            });
        case ADD_APPLICATION:
            return {...state, ...action.payload}
        default:
            return state;
    }
};

export default ApplicationsReducer;
