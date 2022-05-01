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

import {ADD_APPLICATION, EDIT_APPLICATION, LOAD_APPLICATIONS, REMOVE_APPLICATION, SAVE_PARAMETER} from "./types";
import axios from 'axios';


export const saveParameter = (parameter) => ({
    type: SAVE_PARAMETER,
    payload:{
        name: parameter.name,
        value: parameter.value,
        app:parameter.app
    }
});

export const loadApplications = parameters => ({
    type: LOAD_APPLICATIONS,
    payload: parameters
});


export const addApplication = application =>({
    type: ADD_APPLICATION,
    payload:application
});

export const editApplication = edit => ({
    type: EDIT_APPLICATION,
    payload: edit
});

export const removeApplication = application =>({
    type: REMOVE_APPLICATION,
    payload:application
});



