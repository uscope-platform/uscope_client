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
import type {EmulatorState} from "#interfaces/index.js";
import {up_emulator} from "#client_core/index.js";

const initialState: EmulatorState = {}

const EmulatorSlice = createSlice({
    name: 'emulators',
    initialState,
    reducers: {
        addEmulator(state: EmulatorState, action: PayloadAction<up_emulator>) {
            return {...state, ...{[action.payload.id]:action.payload}}
        },
        removeEmulator(state: EmulatorState, action: PayloadAction<number>) {
            return  Object.keys(state)
                .filter(key => {
                    return key !== action.payload.toString();
                })
                .reduce((obj: EmulatorState, key) => {
                    obj[parseInt(key)] = state[parseInt(key)]!;
                    return obj;
                }, {});
        },
        loadAllEmulators(state: EmulatorState, action: PayloadAction<EmulatorState>) {
            return action.payload;
        },
        update_emulator(state: EmulatorState, action: PayloadAction<up_emulator>) {
            state[action.payload.id] = action.payload
        },
    },
})


// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const {
    addEmulator,
    removeEmulator,
    loadAllEmulators,
    update_emulator
} = EmulatorSlice.actions

// Export the slice reducer as the default export
export default EmulatorSlice.reducer