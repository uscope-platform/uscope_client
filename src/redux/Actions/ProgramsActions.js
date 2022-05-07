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

import {ADD_PROGRAM, LOAD_ALL_PROGRAMS, REMOVE_PROGRAM} from "./types";

export const AddProgram = program =>({
    type: ADD_PROGRAM,
    payload:program
});

export const removeProgram = program =>({
    type: REMOVE_PROGRAM,
    payload:program
});

export const loadAllPrograms = programs =>({
    type: LOAD_ALL_PROGRAMS,
    payload:programs
});
