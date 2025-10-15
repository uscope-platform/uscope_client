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


import axios, {type AxiosResponse} from "axios";

let server_address: string = "";
let auth_config: any = null;

export const set_address = (address: string) =>{
    server_address = address;
};

export const set_auth_config = (config: any) => {
    auth_config = config;
};


export const backend_get =<T = any> (endpoint: string): Promise<T> => {
    return new Promise( (resolve, reject) => {
        axios.get<T>(server_address+endpoint, auth_config)
            .then(res => {
                resolve(res.data);
            }).catch(error => {
                reject(error);
            });
    });
}

export const backend_post = <T = any> (endpoint: string, data: any): Promise<T> => {
    return new Promise( (resolve, reject) => {
        axios.post(server_address + endpoint, data, auth_config)
            .then(res => {
                resolve(res.data);
            }).catch(error => {
                reject(error);
            });
    });
}

export const backend_delete = (endpoint: string, data?: any): Promise<AxiosResponse> => {
    return new Promise( (resolve, reject) => {
        axios.delete(server_address + endpoint, {...auth_config, data:data})
            .then(res => {
                resolve(res.data);
            }).catch(error => {
            reject(error);
        });
    });
}

export const backend_patch = (endpoint: string, data: any): Promise<AxiosResponse> => {
    return new Promise( (resolve, reject) => {
        axios.patch(server_address + endpoint, data, auth_config)
            .then(res => {
                resolve(res.data);
            }).catch(error => {
            reject(error);
        });
    });
}
