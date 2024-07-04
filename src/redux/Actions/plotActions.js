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

import {
    SET_CHANNEL_STATUS,
    FETCH_DATA,
    INITIALIZE_CHANNELS
} from "./types";
import axios from "axios";


export const setChannelStatus = (server_url, status, config) =>{
    return dispatch => {
        return axios.post(server_url,status, config).then(res => {
            dispatch(setChannelStatusDone(status));
        }).catch(err => {
            alert('ERROR: error while setting a channel status\n' + err.message);
        });
    };
}

const setChannelStatusDone = (status) =>{
    return{
        type: SET_CHANNEL_STATUS,
        payload:{
            channel: status,
            enabled: true
        }
    }
};

export const initialize_channels = (data) =>{
    return{
        type: INITIALIZE_CHANNELS,
        payload: data
    }
};


export const fetchData = (server_url, config) => {
    return dispatch => {
        return axios.get(server_url, config).then(res => {
            dispatch(fetchDataDone(res.data));
        }).catch(err => {
            alert('ERROR: error while fetching channel data\n' + err.message);
        });
    };
};

export const fetchDataDone = data =>({
    type: FETCH_DATA,
    payload: data
});
