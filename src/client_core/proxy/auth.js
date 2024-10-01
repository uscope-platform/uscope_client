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

import {backend_post} from "./backend";
import {api_dictionary} from "./api_dictionary";

export const sign_in = (credentials) => {
    return new Promise((resolve, reject) => {
        backend_post("auth/login", credentials).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            alert("login failed");
            reject(err);
        })
    });
};

export const manual_sign_in = (credentials) => {
    return new Promise((resolve, reject) => {
        backend_post(api_dictionary.platform.users.manual_login, credentials).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            alert("login failed");
            reject(err);
        })
    });
};



export const auto_sign_in = (credentials) => {
    return new Promise((resolve, reject) => {
        backend_post(api_dictionary.platform.users.auto_login, credentials).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            alert("login failed");
            reject(err);
        })
    });
};
