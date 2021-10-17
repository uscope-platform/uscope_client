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

import {ADD_BITSTREAM, EDIT_BITSTREAM, LOAD_ALL_BITSTREAMS, REMOVE_BITSTREAM} from "./types";
import axios from "axios";
import {setSetting} from "./SettingsActions";

export const addBitstream = (server_url, script, config) =>{
    return dispatch => {
        axios.post(server_url, script, config).then(res => {
            dispatch(AddBitstreamDone(script));
        }).catch(err => {
            alert('ERROR: error while adding a bitstream\n' + err.message);
        });
    };
};

const AddBitstreamDone = bitstream =>({
    type: ADD_BITSTREAM,
    payload:bitstream
});


export const editBitstream = (server_url, script, config) =>{
    return dispatch => {
        axios.patch(server_url,script, config).then(res => {
            dispatch(editBitstreamDone(script));
        }).catch(err => {
            alert('ERROR: error while editing a bitstream\n' + err.message);
            dispatch(editBitstreamDone(script));
        });
    };
};

const editBitstreamDone = bitstream =>({
    type: EDIT_BITSTREAM,
    payload:bitstream
});

export const removeBitstream = (server_url, script, config) =>{
    return dispatch => {
        axios.delete(server_url, config).then(res => {
            dispatch(removeBitstreamDone(script));
        }).catch(err => {
            alert('ERROR: error while removing a bitstream\n' + err.message);
        });
    };
};

const removeBitstreamDone = bitstream =>({
    type: REMOVE_BITSTREAM,
    payload:bitstream
});


export const loadAllBitstreams = (server_url, config) =>{
    return dispatch => {
        axios.get(server_url, config).then(res => {
            dispatch(loadAllBitstreamsDone(res.data));
            dispatch(setSetting(["loaded_bitstreams", true]));
        }).catch(err => {
            alert('ERROR: error while loading all bitstreams\n' + err.message);
        });
    };
};

const loadAllBitstreamsDone = bitstreams =>({
    type: LOAD_ALL_BITSTREAMS,
    payload:bitstreams
});
