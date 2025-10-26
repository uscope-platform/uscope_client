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


import store from "../store.js";
import {up_application, up_emulator, up_peripheral} from "./index.js"
import {backend_get} from "./proxy/backend.js";
import {api_dictionary} from "./proxy/api_dictionary.js";
import {
    loadAllBitstreams,
    loadAllEmulators,
    loadAllFilters,
    loadAllPrograms,
    loadAllScripts,
    loadApplications,
    loadPeripherals
} from "#redux/index.js";
import {up_script} from "./data_models/up_script.js";
import {up_program} from "./data_models/up_program.js";
import {up_bitstream} from "./data_models/up_bitstream.js";
import {up_filter} from "./data_models/up_filter.js";
import type {cache_result} from "#interfaces/index.js";

let load_all_applications = async () => {

    let raw_apps = await backend_get(api_dictionary.applications.load_all);
    let apps_dict: Record<string, up_application> = {}
    for (let item in raw_apps) {
        let id = raw_apps[item].id;
        apps_dict[id] = new up_application(raw_apps[item]);
    }
    store.dispatch(loadApplications(apps_dict));
    return apps_dict;

}

let load_all_peripherals = async () => {
    let raw_periph = await backend_get(api_dictionary.peripherals.load_all);
    let periph_dict: Record<string, up_peripheral> = {}
    for (let item in raw_periph) {
        let id = raw_periph[item].id;
        periph_dict[id] = new up_peripheral(raw_periph[item]);
    }
    store.dispatch(loadPeripherals(periph_dict));
    return periph_dict;

}

let load_all_scripts = async () => {
    let raw_scr = await  backend_get(api_dictionary.scripts.load_all);
    let scripts_dict: Record<string, up_script> = {}
    for (let item in raw_scr) {
        let id = raw_scr[item].id;
        scripts_dict[id] = new up_script(raw_scr[item]);
    }
    store.dispatch(loadAllScripts(scripts_dict));
    return scripts_dict;
}

let load_all_programs =async () => {
    let raw_prog = await backend_get(api_dictionary.programs.load_all);
    let programs_dict: Record<string, up_program> = {}
    for (let item in raw_prog) {
        let id = raw_prog[item].id;
        programs_dict[id] = new up_program(raw_prog[item]);
    }
    store.dispatch(loadAllPrograms(programs_dict));
    return programs_dict;
}

let load_all_bitstreams = async () =>{
    let raw_bit =await backend_get(api_dictionary.bitstream.load_all);
    let bitstreams_dict: Record<string, up_bitstream> = {}
    for (let item in raw_bit) {
        let id = raw_bit[item].id;
        bitstreams_dict[id] = new up_bitstream(raw_bit[item]);
    }
    store.dispatch(loadAllBitstreams(bitstreams_dict));
    return bitstreams_dict;
}

let load_all_filters = async () =>{
    let raw_flt = await backend_get(api_dictionary.filters.load_all);
    let filters_dict: Record<string, up_filter> = {}
    for (let item in raw_flt) {
        let id = raw_flt[item].id;
        filters_dict[id] = new up_filter(raw_flt[item]);
    }
    store.dispatch(loadAllFilters(filters_dict));
    return filters_dict;
}


let load_all_emulators = async () =>{
    let raw_emu = await backend_get(api_dictionary.emulators.load_all);
    let emulators_dict: Record<string, up_emulator> = {}
    for (let item in raw_emu) {
        let id = raw_emu[item].id;
        emulators_dict[id] = new up_emulator(raw_emu[item]);
    }
    store.dispatch(loadAllEmulators(emulators_dict));
    return emulators_dict;
}



export const refresh_caches = (): Promise<cache_result[]> =>{
    let state = store.getState();
    const refresh_ops: Promise<cache_result>[] = [];

    refresh_ops.push(refresh_resource_cache("application_cache", state.applications, load_all_applications ,()=>{return backend_get(api_dictionary.applications.get_hash)}));
    refresh_ops.push(refresh_resource_cache("peripheral_cache", state.peripherals, load_all_peripherals,()=>{return backend_get(api_dictionary.peripherals.get_hash)}));
    refresh_ops.push(refresh_resource_cache("scripts_cache", state.scripts, load_all_scripts , ()=>{return backend_get(api_dictionary.scripts.get_hash)}));
    refresh_ops.push(refresh_resource_cache("programs_cache",state.programs, load_all_programs , ()=>{return backend_get(api_dictionary.programs.get_hash)}));
    refresh_ops.push(refresh_resource_cache("bitstreams_cache",state.bitstreams, load_all_bitstreams , ()=>{return backend_get(api_dictionary.bitstream.get_hash)}));
    refresh_ops.push(refresh_resource_cache("filters_cache",state.filters, load_all_filters , ()=>{return backend_get(api_dictionary.filters.get_hash)}));
    refresh_ops.push(refresh_resource_cache("emulators_cache",state.emulators, load_all_emulators , ()=>{return backend_get(api_dictionary.emulators.get_hash)}));
    return Promise.all(refresh_ops);
};


let refresh_resource_cache = (key: string,resource: any, load_fcn: any, hash_fcn: any):  Promise<cache_result> => {
    return new Promise((resolve, reject) =>{
        let digest = localStorage.getItem(key);
        if(resource === undefined || digest === null){
            load_fcn().then((load_res: any)=>{
                hash_fcn().then((hash_res: any)=>{
                    localStorage.setItem(key, hash_res);
                    resolve({data:load_res, hash:hash_res, status:"hard_load"})
                });
            })
        } else{
            hash_fcn().then((hash_res: any)=>{
                if(digest!==hash_res){
                    load_fcn().then((load_res: any)=>{
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



export const save_ui_state = (application: up_application, name: string, value: any) =>{
    let raw_state = localStorage.getItem(name);
    if(!raw_state) raw_state = "{}";
    let new_cache = JSON.parse(raw_state);
    if(!new_cache) new_cache = {};
    new_cache[application.application_name] = value;
    localStorage.setItem(name,JSON.stringify(new_cache));
};


export const get_ui_state = (application: up_application, name:string, default_value: any) =>{
    let raw_state = localStorage.getItem(name);
    if(!raw_state) return default_value;
    let old_cache_val = JSON.parse(raw_state);
    if(old_cache_val && old_cache_val[application.application_name]) return old_cache_val[application.application_name];
    else return default_value
};

