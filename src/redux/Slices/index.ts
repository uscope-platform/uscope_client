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

import {combineReducers} from "redux"

import PeripheralSlice from './peripheralSlice.js'
import ApplicationSlice from './applicationSlice.js'
import ProgramSlice from "./programSlice.js"
import BitstreamSlice from "./bitstreamSlice.js"
import FilterSlice from "./filterSlice.js"
import EmulatorSlice from "./emulatorSlice.js"
import scriptSlice from "./scriptSlice.js"

export default combineReducers({
    bitstreams: BitstreamSlice,
    peripherals: PeripheralSlice,
    applications: ApplicationSlice,
    programs: ProgramSlice,
    scripts: scriptSlice,
    filters: FilterSlice,
    emulators: EmulatorSlice
    });
