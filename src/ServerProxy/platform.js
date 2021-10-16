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

import axios from "axios";
import store from "../store";

let PlatformProxy = class{

    add_user = user =>{
        return new Promise((resolve, reject) => {
            let state = store.getState();
            axios.post(    state.settings.server_url+'auth/user', user, state.settings.auth_config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    };

    remove_user = user =>{
        return new Promise((resolve, reject) => {
            let state = store.getState();
            axios.delete(state.settings.server_url+'auth/user', {...state.settings.auth_config, data:user}).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    };

    need_onboarding = () =>{
        return new Promise((resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'auth/onboarding').then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    };

    do_onboarding = user =>{
        return new Promise((resolve, reject) => {
            let state = store.getState();
            axios.post(state.settings.server_url+'auth/onboarding', user, state.settings.auth_config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    };

    get_users_list = ()=>{
        return new Promise((resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'auth/user', state.settings.auth_config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    }

    dump_database = () =>{
        return new Promise((resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'database/export', state.settings.auth_config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    }

    restore_database = (db_file) =>{
        let state = store.getState();
        axios.post(state.settings.server_url+'database/import',db_file, state.settings.auth_config);
    }

}

export default PlatformProxy;
