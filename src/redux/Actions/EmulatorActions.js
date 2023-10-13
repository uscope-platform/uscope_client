// Copyright 2023 Filippo Savi
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

import {ADD_EMULATOR, REMOVE_EMULATOR, LOAD_ALL_EMULATOR} from "./types";

export const AddEmulator = emulator =>({
    type: ADD_EMULATOR,
    payload:emulator
});

export const removeEmulator = emulator =>({
    type: REMOVE_EMULATOR,
    payload:emulator
});

export const loadAllEmulator = emulator =>({
    type: LOAD_ALL_EMULATOR,
    payload:emulator
});
