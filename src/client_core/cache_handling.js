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


import {store, up_application, up_emulator, up_peripheral} from "./index"
import {backend_get} from "./proxy/backend";
import {api_dictionary} from "./proxy/api_dictionary";
import {loadApplications} from "../redux/Actions/applicationActions";
import {loadPeripherals} from "../redux/Actions/peripheralsActions";
import {loadAllScripts} from "../redux/Actions/scriptsActions";
import {up_script} from "./data_models/up_script";
import {up_program} from "./data_models/up_program";
import {loadAllPrograms} from "../redux/Actions/ProgramsActions";
import {up_bitstream} from "./data_models/up_bitstream";
import {loadAllBitstreams} from "../redux/Actions/bitstreamsActions";
import {loadAllFilters} from "../redux/Actions/FiltersActons";
import {up_filter} from "./data_models/up_filter";
import {loadAllEmulators} from "../redux/Actions/EmulatorActions";

let load_all_applications = () => {
    return backend_get(api_dictionary.applications.load_all).then(res=>{
        let apps_dict = {}
        for (let item in res) {
            apps_dict[item] = new up_application(res[item]);
        }
        store.dispatch(loadApplications(apps_dict));
        return apps_dict;
    })

}

let load_all_peripherals = () => {
    return backend_get(api_dictionary.peripherals.load_all).then(res=>{
        let periph_dict = {}
        for (let item in res) {
            periph_dict[item] = new up_peripheral(res[item]);
        }
        store.dispatch(loadPeripherals(periph_dict));
        return periph_dict;
    })

}

let load_all_scripts = () => {
    return backend_get(api_dictionary.scripts.load_all).then(res=>{
        let scripts_dict = {}
        for (let item in res) {
            scripts_dict[item] = new up_script(res[item]);
        }
        store.dispatch(loadAllScripts(scripts_dict));
        return scripts_dict;
    })
}

let load_all_programs = () => {
    return backend_get(api_dictionary.programs.load_all).then(res=>{
        let programs_dict = {}
        for (let item in res) {
            programs_dict[item] = new up_program(res[item]);
        }
        store.dispatch(loadAllPrograms(programs_dict));
        return programs_dict;
    })
}

let load_all_bitstreams = () =>{
    return backend_get(api_dictionary.bitstream.load_all).then(res=>{
        let bitstreams_dict = {}
        for (let item in res) {
            bitstreams_dict[item] = new up_bitstream(res[item]);
        }
        store.dispatch(loadAllBitstreams(bitstreams_dict));
        return bitstreams_dict;
    })
}

let load_all_filters = () =>{
    return backend_get(api_dictionary.filters.load_all).then(res=>{
        let filters_dict = {}
        for (let item in res) {
            filters_dict[item] = new up_filter(res[item]);
        }
        store.dispatch(loadAllFilters(filters_dict));
        return filters_dict;
    })
}


let load_all_emulators = () =>{
    return backend_get(api_dictionary.emulators.load_all).then(res=>{
        let emulators_dict = {}
        for (let item in res) {
            emulators_dict[item] = new up_emulator(res[item]);
        }
        store.dispatch(loadAllEmulators(emulators_dict));
        return emulators_dict;
    })
}



export const refresh_caches = () =>{
    let state = store.getState();
    let refresh_ops = [];

    refresh_ops.push(refresh_resource_cache("application_cache", state.applications, load_all_applications ,()=>{return backend_get(api_dictionary.applications.get_hash)}));
    refresh_ops.push(refresh_resource_cache("peripheral_cache", state.peripherals, load_all_peripherals,()=>{return backend_get(api_dictionary.peripherals.get_hash)}));
    refresh_ops.push(refresh_resource_cache("scripts_cache", state.scripts, load_all_scripts , ()=>{return backend_get(api_dictionary.scripts.get_hash)}));
    refresh_ops.push(refresh_resource_cache("programs_cache",state.programs, load_all_programs , ()=>{return backend_get(api_dictionary.programs.get_hash)}));
    refresh_ops.push(refresh_resource_cache("bitstreams_cache",state.bitstreams, load_all_bitstreams , ()=>{return backend_get(api_dictionary.bitstream.get_hash)}));
    refresh_ops.push(refresh_resource_cache("filters_cache",state.filters, load_all_filters , ()=>{return backend_get(api_dictionary.filters.get_hash)}));
    refresh_ops.push(refresh_resource_cache("emulators_cache",state.emulators, load_all_emulators , ()=>{return backend_get(api_dictionary.emulators.get_hash)}));
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



export const save_ui_state = (name, value) =>{
    let old_cache_val = JSON.parse(localStorage.getItem(name));
    let app = store.getState().settings.selected_application;
    let new_cache = old_cache_val;
    if(!new_cache) new_cache = {};
    new_cache[app] = value;
    localStorage.setItem(name,JSON.stringify(new_cache));
};


export const get_ui_state = (name, default_value) =>{
    let old_cache_val = JSON.parse(localStorage.getItem(name));
    let app = store.getState().settings.selected_application;
    if(old_cache_val && old_cache_val[app]) return old_cache_val[app];
    else return default_value
};

