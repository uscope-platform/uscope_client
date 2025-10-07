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


import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const bitstreamSlice = createSlice({
    name: 'bitstreams',
    initialState,
    reducers: {
        loadAllBitstreams(state, action) {
            return action.payload;
        },
        AddBitstream(state, action) {
            return {...state, ...{[action.payload.id]:action.payload}}
        },
        removeBitstream(state, action) {
            return Object.keys(state)
                .filter(key => {
                    return key !== action.payload.id.toString();
                })
                .reduce((obj, key) => {
                    obj[key] = state[key];
                    return obj;
                }, {});
        },
    },
})

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const {
    loadAllBitstreams,
    AddBitstream,
    removeBitstream
} = bitstreamSlice.actions

// Export the slice reducer as the default export
export default bitstreamSlice.reducer