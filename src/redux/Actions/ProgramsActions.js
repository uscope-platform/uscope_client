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

import {ADD_PROGRAM, EDIT_PROGRAM, LOAD_ALL_PROGRAMS, REMOVE_PROGRAM} from "./types";
import axios from "axios";
import {setSetting} from "./SettingsActions";

export const addProgram = (server_url, program, config) =>{
    return dispatch => {
        axios.post(server_url, program, config).then(res => {
            dispatch(AddProgramDone(program));
        }).catch(err => {
            alert('ERROR: error while adding a program\n' + err.message);
        });
    };
};

const AddProgramDone = program =>({
    type: ADD_PROGRAM,
    payload:program
});


export const editProgram = (server_url, program, config) =>{
    return dispatch => {
        axios.patch(server_url,program, config).then(res => {
            dispatch(editProgramDone(program));
        }).catch(err => {
            alert('ERROR: error while editing a program\n' + err.message);
            dispatch(editProgramDone(program));
        });
    };
};

const editProgramDone = program =>({
    type: EDIT_PROGRAM,
    payload:program
});

export const removeProgram = (server_url, program, config) =>{
    return dispatch => {
        axios.delete(server_url, config).then(res => {
            dispatch(removeProgramDone(program));
        }).catch(err => {
            alert('ERROR: error while removing a program\n' + err.message);
        });
    };
};

const removeProgramDone = program =>({
    type: REMOVE_PROGRAM,
    payload:program
});


export const loadAllPrograms = (server_url, config) =>{
    return dispatch => {
        axios.get(server_url, config).then(res => {
            dispatch(loadAllProgramsDone(res.data));
            dispatch(setSetting(["loaded_programs", true]));
        }).catch(err => {
            alert('ERROR: error while loading all programs\n' + err.message);
        });
    };
};

const loadAllProgramsDone = programs =>({
    type: LOAD_ALL_PROGRAMS,
    payload:programs
});
