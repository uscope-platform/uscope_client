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
import type {ProgramState} from "#interfaces/redux.js";
import {up_program} from "#client_core/index.js";

const initialState: ProgramState = {}

const programSlice = createSlice({
    name: 'programs',
    initialState,
    reducers: {
        AddProgram(state: ProgramState, action: PayloadAction<up_program>) {
            return {...state, ...{[action.payload.id]:action.payload}}
        },
        removeProgram(state: ProgramState, action: PayloadAction<up_program>) {
            return  Object.keys(state)
                .filter(key => {
                    return key !== action.payload.id.toString();
                })
                .reduce((obj:ProgramState, key) => {
                    obj[parseInt(key)] = state[parseInt(key)]!;
                    return obj;
                }, {});
        },
        loadAllPrograms(state: ProgramState, action: PayloadAction<ProgramState>) {
            return action.payload
        }
    },
})

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const {
    AddProgram,
    removeProgram,
    loadAllPrograms
} = programSlice.actions

// Export the slice reducer as the default export
export default programSlice.reducer