// Copyright 2021 Filippo Savi
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

import store from "../../store";
import {fetchData, loadChanels, setChannelStatus} from "../../redux/Actions/plotActions";
import {backend_get, backend_post, dispatch_redux_thunk} from "./backend";

import {api_dictionary} from './api_dictionary'

export const get_channel_info = (loading_done_handler) => {
    backend_get(api_dictionary.plot.get_info).then(res => {
        store.dispatch(loadChanels(res.data));
        loading_done_handler();
    }).catch(err => {
        console.log(err)
        alert('ERROR: error while loading channels info\n' + err.message);
    })
};

export const fetch_data = () =>  {
    return dispatch_redux_thunk(fetchData, api_dictionary.plot.fetch_data)
};


export const set_capture =  (capture_lenght) =>  {
    return new Promise((resolve, reject)=>{
        backend_post(api_dictionary.plot.set_capture, {length: capture_lenght}).then((res) => {
            resolve(res)
        }).catch((err) =>{
            alert('ERROR: error while setting up capture\n' + err.message);
            reject(err);
        })
    })
};

export const get_captured_data = () =>{
    return backend_get(api_dictionary.plot.get_capture);
}

export const set_channel_status = (channel) => {
    return dispatch_redux_thunk(setChannelStatus, api_dictionary.plot.set_channel_status, channel);
}

export const set_channel_widths = (widths) => {
    return new Promise((resolve, reject)=>{
        backend_post(api_dictionary.plot.set_widths, {widths}).then((res) => {
            resolve(res)
        }).catch((err) =>{
            alert('ERROR: error while setting up channel widths\n' + err.message);
            reject(err);
        })
    })
}