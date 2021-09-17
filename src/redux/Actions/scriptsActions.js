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

import {ADD_SCRIPT, EDIT_SCRIPT, LOAD_ALL_SCRIPTS, REMOVE_SCRIPT, SAVE_SCRIPT_WORKSPACE} from "./types";
import axios from "axios";
import {setSetting} from "./SettingsActions";


export const saveScriptsWorkspace = (workspace) => ({
    type: SAVE_SCRIPT_WORKSPACE,
    payload:workspace
});


export const addScript = (server_url, script, config) =>{
    return dispatch => {
        axios.post(server_url, script, config).then(res => {
            dispatch(AddScriptDone(script));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const AddScriptDone = script =>({
    type: ADD_SCRIPT,
    payload:script
});


export const editScript = (server_url, script, config) =>{
    return dispatch => {
        axios.patch(server_url,script, config).then(res => {
            dispatch(editScriptDone(script));
        }).catch(err => {
            alert(err.message);
            dispatch(editScriptDone(script));
        });
    };
};

const editScriptDone = script =>({
    type: EDIT_SCRIPT,
    payload:script
});

export const removeScript = (server_url, script, config) =>{
    return dispatch => {
        axios.delete(server_url, config).then(res => {
            dispatch(removeScriptDone(script));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const removeScriptDone = script =>({
    type: REMOVE_SCRIPT,
    payload:script
});


export const loadAllScripts = (server_url, config) =>{
    return dispatch => {
        axios.get(server_url, config).then(res => {
            dispatch(loadAllScriptsDone(res.data));
            dispatch(setSetting(["loaded_scripts", true]));
        }).catch(err => {
            alert(err.message);
        });
    };
};

const loadAllScriptsDone = script =>({
    type: LOAD_ALL_SCRIPTS,
    payload:script
});
