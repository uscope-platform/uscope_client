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




import {setSetting} from "../redux/Actions/SettingsActions";
import {store} from "./index"
import {get_applications_hash, load_all_applications} from './proxy/applications'
import {get_peripherals_hash, load_all_peripherals} from "./proxy/peripherals";
import {get_scripts_hash, load_all_scripts} from "./proxy/scripts";
import {get_programs_hash, load_all_programs} from "./proxy/programs";
import {get_bitstreams_hash,load_all_bitstreams} from "./proxy/bitstreams";

export const refresh_caches = () =>{
    let state = store.getState();
    let refresh_ops = [];

    refresh_ops.push(refresh_resource_cache("application_cache", state.applications, load_all_applications , get_applications_hash));
    refresh_ops.push(refresh_resource_cache("peripheral_cache", state.peripherals, load_all_peripherals, get_peripherals_hash));
    refresh_ops.push(refresh_resource_cache("scripts_cache", state.scripts, load_all_scripts , get_scripts_hash));
    refresh_ops.push(refresh_resource_cache("programs_cache",state.programs, load_all_programs , get_programs_hash));
    refresh_ops.push(refresh_resource_cache("bitstreams_cache",state.bitstreams, load_all_bitstreams , get_bitstreams_hash));
    return Promise.all(refresh_ops);
};


let refresh_resource_cache = (key,resource, load_fcn, hash_fcn) => {
    return new Promise((resolve, reject) =>{
        let digest = localStorage.getItem(key);
        if(resource === undefined || digest === null){
            load_fcn().then((load_res)=>{
                hash_fcn().then((hash_res)=>{
                    localStorage.setItem(key, hash_res);
                    resolve({data:load_res, hash:hash_res, status:"hard_load"})
                });
            })
        } else{
            hash_fcn().then((hash_res)=>{
                if(digest!==hash_res){
                    load_fcn().then((load_res)=>{
                        localStorage.setItem(key, hash_res);
                        resolve({data:load_res, hash:hash_res, status:"refresh"})
                    })
                } else{
                    resolve({data:null, hash:hash_res, status:"valid"})
                }
            });
        }
    })

}
