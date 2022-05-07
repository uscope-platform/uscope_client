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


import axios from "axios";
import {store} from "../index"

let server_address = null;
let auth_config = null;

export const set_address = (address) =>{
    server_address = address;
};

export const set_auth_config = (config) => {
    auth_config = config;
};


export const backend_get = (endpoint) => {
    return new Promise( (resolve, reject) => {
        axios.get(server_address+endpoint, auth_config)
            .then(res => {
                resolve(res.data);
            }).catch(error => {
                reject(error);
            });
    });
}

export const backend_post = (endpoint, data) => {
    return new Promise( (resolve, reject) => {
        axios.post(server_address + endpoint, data, auth_config)
            .then(res => {
                resolve(res.data);
            }).catch(error => {
                reject(error);
            });
    });
}

export const backend_delete = (endpoint, data) => {
    return new Promise( (resolve, reject) => {
        axios.delete(server_address + endpoint, {...auth_config, data:data})
            .then(res => {
                resolve(res.data);
            }).catch(error => {
            reject(error);
        });
    });
}

export const backend_patch = (endpoint, data) => {
    return new Promise( (resolve, reject) => {
        axios.patch(server_address + endpoint, data, auth_config)
            .then(res => {
                resolve(res.data);
            }).catch(error => {
            reject(error);
        });
    });
}





export const dispatch_redux_thunk = (action, endpoint, data) => {
    if(data) {
        return store.dispatch(action(server_address + endpoint, data, auth_config))
    } else {
        return store.dispatch(action(server_address + endpoint, auth_config));
    }

}
