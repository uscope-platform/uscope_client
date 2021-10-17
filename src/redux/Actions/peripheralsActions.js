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

import { ADD_PERIPHERAL, EDIT_PERIPHERAL, LOAD_PERIPHERALS, REMOVE_PERIPHERAL} from "./types";
import axios from 'axios';
import {setSetting} from "./SettingsActions";


export const loadPeripherals = (server_url, config) => {
    return dispatch => {
        axios.get(server_url, config).then(res => {
            dispatch(loadPeripheralsDone(res.data));
            dispatch(setSetting(["loaded_peripherals", true]));
        }).catch(err => {
            alert('ERROR: error while loading all peripherals\n' + err.message);
        });
    };
};

const loadPeripheralsDone = parameters => ({
    type: LOAD_PERIPHERALS,
    payload: parameters
});

export const editPeripheral = (server_url, edit, config) => {
    return dispatch => {
        axios.post(server_url, edit, config).then(res => {
            dispatch(editPeripheralDone(edit));
        }).catch(err => {
            alert('ERROR: error while editing a peripheral\n' + err.message);
        });
    };
};

const editPeripheralDone = edit => ({
    type: EDIT_PERIPHERAL,
    payload: edit
});


export const removePeripheral = (server_url, peripheral, config) =>{
    return dispatch => {
        axios.get(server_url, config).then(res => {
            dispatch(removePeripheralDone(peripheral));
        }).catch(err => {
            alert('ERROR: error while removing a peripheral\n' + err.message);
        });
    };
};

const removePeripheralDone = peripheral =>({
  type: REMOVE_PERIPHERAL,
  payload:peripheral
});


export const addPeripheral = (server_url, peripheral_obj, config) =>{
    return dispatch => {
        axios.post(server_url, peripheral_obj, config).then(res => {
            dispatch(addPeripheralDone(peripheral_obj));
        }).catch(err => {
            alert('ERROR: error while adding a peripheral\n' + err.message);
        });
    };
};

const addPeripheralDone = peripheral_obj =>({
    type: ADD_PERIPHERAL,
    payload:peripheral_obj
});