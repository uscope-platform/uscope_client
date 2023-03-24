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
} from "./types";


export const loadPeripherals = peripherals => ({
    type: LOAD_PERIPHERALS,
    payload: peripherals
});

export const addPeripheral = peripheral_obj =>({
    type: ADD_PERIPHERAL,
    payload:peripheral_obj
});

export const removePeripheral = peripheral =>({
    type: REMOVE_PERIPHERAL,
    payload:peripheral
});

export const upsertRegister =  (register_obj, reg_id, periph) =>({
    type: UPSERT_REGISTER,
    register_id: reg_id,
    parent:periph,
    payload:register_obj
});

export const upsertField =  (field_obj,field_id, register, periph) =>({
    type: UPSERT_FIELD,
    parent_reg:register,
    parent_periph: periph,
    field_id:field_id,
    payload:field_obj
});

export const removeRegister = (peripheral, register) =>({
    type: REMOVE_REGISTER,
    payload: {periph:peripheral, reg:register}
});

export const removeField = (peripheral, register, field) =>({
    type: REMOVE_FIELD,
    payload: {periph:peripheral, reg:register, field:field}
});