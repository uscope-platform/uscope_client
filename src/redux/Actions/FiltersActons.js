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

import {ADD_FILTER, REMOVE_FILTER, LOAD_ALL_FILTERS} from "./types";

export const AddFilter = filter =>({
    type: ADD_FILTER,
    payload:filter
});

export const removeFilter = filter =>({
    type: REMOVE_FILTER,
    payload:filter
});

export const loadAllFilters = filters =>({
    type: LOAD_ALL_FILTERS,
    payload:filters
});
