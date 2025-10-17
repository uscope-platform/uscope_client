/*
 * Copyright(c) 2025. Filippo Savi
 * Author: Filippo Savi <filssavi@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */



import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {
    PeripheralsState,
    register_field_upsert_action,
    register_register_upsert_action, remove_field_action, remove_register_action
} from "#interfaces/redux.js";

const initialState: PeripheralsState= {}

const PeripheralSlice = createSlice({
    name: 'peripheral',
    initialState,
    reducers: {
        loadPeripherals(state: PeripheralsState, action: PayloadAction<PeripheralsState>) {
            return action.payload
        },
        addPeripheral(state: PeripheralsState, action: PayloadAction<PeripheralsState>) {
            return {...state, ...action.payload}
        },
        removePeripheral(state: PeripheralsState, action: PayloadAction<number>) {
            return Object.keys(state)
            .filter(key => {
                return parseInt(key) !== action.payload;
            })
            .reduce((obj: PeripheralsState, key) => {
                obj[parseInt(key)] = state[parseInt(key)]!;
                return obj;
            }, {});
        },
        upsertField(state: PeripheralsState, action: PayloadAction<register_field_upsert_action>) {
            state[action.payload.obj.parent_peripheral]!.registers = state[action.payload.obj.parent_peripheral]!.registers.map((reg) =>{
                if(reg.register_name === action.payload.obj.parent_register) {
                    reg.fields = reg.fields.map((f) => {
                        if (f.name === action.payload.name) {
                            return action.payload.obj;
                        } else
                            return f;
                    })
                }
                return reg;
            });
        },
        upsertRegister(state: PeripheralsState, action: PayloadAction<register_register_upsert_action>) {
            Object.keys(state).map((key=>{
                state[action.payload.obj.parent_periph]!.registers = state[action.payload.obj.parent_periph]!.registers.map((reg) =>{
                    if(reg.ID === action.payload.id)
                        return action.payload.obj;
                    else
                        return reg;
                });
                return [];
            }))
        },
        removeField(state:PeripheralsState, action: PayloadAction<remove_field_action>) {
            state[action.payload.periph]!.registers = state[action.payload.periph]!.registers.map((reg) =>{
                if(reg.ID === action.payload.reg) {
                    reg.fields = reg.fields.filter((f) => {
                        return f.name !== action.payload.field
                    })
                }
                return reg;
            });
        },
        removeRegister(state:PeripheralsState, action: PayloadAction<remove_register_action>) {
            state[action.payload.periph]!.registers = state[action.payload.periph]!.registers.filter((reg) =>{
                return reg.ID !== action.payload.reg;
            });
        }
    },
})

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const {
    removeField,
    removeRegister,
    upsertField,
    upsertRegister,
    removePeripheral,
    addPeripheral,
    loadPeripherals
} = PeripheralSlice.actions

// Export the slice reducer as the default export
export default PeripheralSlice.reducer