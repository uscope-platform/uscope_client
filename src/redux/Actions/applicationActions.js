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

export const loadApplications = (server_url, config) => {
    return (dispatch, getState) => {
        return axios.get(server_url, config).then(res => {
            dispatch(loadApplicationsDone(res.data));
            return res.data;
        }).catch(err => {
            alert('ERROR: error while loading all applications\n' + err.message);
        });
    };
};

const loadApplicationsDone = parameters => ({
    type: LOAD_APPLICATIONS,
    payload: parameters
});


export const editApplication = (server_url,edit, config) => {

    return dispatch => {
        return axios.post(server_url, edit, config).then(res => {
            dispatch(editApplicationDone(edit));
        }).catch(err => {
            alert('ERROR: error while editing an application\n' + err.message);
        });
    };
};

const editApplicationDone = edit => ({
    type: EDIT_APPLICATION,
    payload: edit
});


export const removeApplication = (server_url, application, config) =>{
    return dispatch => {
        return axios.get(server_url, config).then(res => {
            dispatch(removeApplicationDone(application));
        }).catch(err => {
            alert('ERROR: error while removing an application\n' + err.message);
        });
    };
};

const removeApplicationDone = application =>({
    type: REMOVE_APPLICATION,
    payload:application
});

export const addApplication = (server_url, application_obj, config) =>{
    return dispatch => {
        return axios.post(server_url, application_obj, config).then(res => {
            dispatch(addApplicationDone(application_obj));
            return res;
        }).catch(err => {
            alert('ERROR: error while adding an application\n' + err.message);
        });
    };
};

const addApplicationDone = application =>({
    type: ADD_APPLICATION,
    payload:application
});


