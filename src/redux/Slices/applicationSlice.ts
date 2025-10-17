// Copyright 2025 Filippo Savi
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
import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {ApplicationsState, parameter_save_action} from "#interfaces/redux.js";
import {up_application} from "#client_core/index.js";

const initialState: ApplicationsState = {}

const applicationsSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        saveParameter(state: ApplicationsState, action: PayloadAction<parameter_save_action>) {

            let target = state[action.payload.app]!["parameters"].filter((item)=>{
                return item['parameter_id'] === action.payload.name;
            })[0];
            target!.value = action.payload.value;
        },
        loadApplications(state: ApplicationsState, action:  PayloadAction<ApplicationsState>) {
            return action.payload;
        },
        addApplication(state: ApplicationsState, action: PayloadAction<ApplicationsState>) {
            return  {...state, ...action.payload}
        },
        removeApplication(state: ApplicationsState, action: PayloadAction<number>) {
            return  Object.keys(state)
                .filter(key => {
                    return parseInt(key) !== action.payload;
                }).reduce((obj: ApplicationsState, key) => {
                    obj[parseInt(key)] = state[parseInt(key)]!;
                    return obj;
                }, {});
        },
        updateApplication(state: ApplicationsState, action: PayloadAction<up_application>) {
            state[action.payload.id] = action.payload;
        },
    },
})

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const {
    saveParameter,
    loadApplications,
    addApplication,
    removeApplication,
    updateApplication
} = applicationsSlice.actions

// Export the slice reducer as the default export
export default applicationsSlice.reducer