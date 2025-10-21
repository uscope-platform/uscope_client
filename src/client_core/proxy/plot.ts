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

import {backend_get, backend_post} from "./backend.js";

import {api_dictionary} from './api_dictionary.js'
import type {scope_control, scope_data_object, scope_settings, ScopeStatus} from "#interfaces/index.js";


export const direct_fetch = (): Promise<scope_data_object[]> =>  {
    return new Promise((resolve, reject)=>{
        backend_get(api_dictionary.operations.fetch_data).then((res) => {
            resolve(res)
        }).catch((err) =>{
            reject(err);
        });
    });
};



export const set_channel_status = (channel: Record<number, boolean>) => {
    return new Promise((resolve, reject)=>{
        backend_post(api_dictionary.operations.set_channel_status, channel).then((res) => {
            resolve(res)
        }).catch((err) =>{
            alert('ERROR: error while setting a channel status\n' + err.message);
            reject(err);
        })
    });
}


export const set_scaling_factors = (scaling_factors: number[]) => {
    return new Promise((resolve, reject)=>{
        backend_post(api_dictionary.operations.scaling_factors, scaling_factors).then((res) => {
            resolve(res)
        }).catch((err) =>{
            alert('ERROR: error while setting up channel scaling factors\n' + err.message);
            reject(err);
        })
    })
}

export let get_acquisition_status = (): Promise<ScopeStatus> =>{
    return new Promise((resolve, reject)=>{
        backend_get(api_dictionary.operations.acquisition).then((res) => {
            resolve(res)
        }).catch((err) =>{
            reject(err);
        });
    });
}

export let set_acquisition = (args: scope_control) =>{
    return new Promise((resolve, reject)=>{
        backend_post(api_dictionary.operations.acquisition, args).then((res) => {
            resolve(res)
        }).catch((err) =>{
            reject(err);
        });
    });
}

export let set_scope_address  = (args: scope_settings) =>{
    return new Promise((resolve, reject)=>{
        backend_post(api_dictionary.operations.scope_address, args).then((res) => {
            resolve(res)
        }).catch((err) =>{
            reject(err);
        });
    });
}