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

import {refresh_caches, set_address, set_redis_store} from "../../src/client_core";
import {mock_store, initial_redux_state} from "./mock/redux_store";
import {LOAD_ALL_SCRIPTS} from "../../src/redux/Actions/types";


const localStorageMock = (function() {
    let state = {
        "test_item": 123
    }

    return {
        getItem: function(key) {
            return state[key] || null
        },
        setItem: function(key, value) {
            state[key] = value.toString()
        },
        removeItem: function(key) {
            delete state[key]
        },
        clear: function() {
            state = {}
        },
        initialize: function(s) {
            state = s
        },
        get_state: function (){
            return state;
        }
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})



let check_test_results = (redux_reference) => {
    let storage_state = localStorage.get_state();
    let state = mock_store.getState();

    expect(storage_state.application_cache).toBe("9bcb1e2d-dc4c-44cb-be5d-3897f288c617");
    expect(storage_state.peripheral_cache).toBe("94c46594-3bb9-4fae-b6aa-a61e03a288e2");
    expect(storage_state.bitstreams_cache).toBe("74478cc1-fdb7-486a-975c-129c71400530");
    expect(storage_state.programs_cache).toBe("d0f84519-10da-4ada-8727-8bd6a0f608e0");
    expect(storage_state.scripts_cache).toBe("9701008d-c511-4ded-94b3-b08748a6e066");

    expect(state.applications).toStrictEqual(redux_reference.applications);
    expect(state.peripherals).toStrictEqual(redux_reference.peripherals);
    expect(state.scripts).toStrictEqual(redux_reference.scripts);
    expect(state.bitstreams).toStrictEqual(redux_reference.bitstreams);
    expect(state.programs).toStrictEqual(redux_reference.programs);

    expect(state.settings.loaded_applications).toBeTruthy();
    expect(state.settings.loaded_peripherals).toBeTruthy();
    expect(state.settings.loaded_scripts).toBeTruthy();
    expect(state.settings.loaded_programs).toBeTruthy();
    expect(state.settings.loaded_bitstreams).toBeTruthy();
}

test("hard_load", () => {

    set_address("test_server/");
    set_redis_store(mock_store);
    return refresh_caches().then((res)=>{
        let redux_reference = {
            "applications":[{application_obj:true}],
            "peripherals":[{peripheral_obj:true}],
            "scripts":[{scripts_obj:true}],
            "bitstreams":[{bitstream_obj:true}],
            "programs":[{programs_obj:true}]
        }
        check_test_results(redux_reference); 
    });
})



test("no_load", () => {
    localStorage.clear();
    localStorage.initialize({
        "peripheral_cache": "94c46594-3bb9-4fae-b6aa-a61e03a288e2",
        "application_cache": "9bcb1e2d-dc4c-44cb-be5d-3897f288c617",
        "bitstreams_cache": "74478cc1-fdb7-486a-975c-129c71400530",
        "programs_cache": "d0f84519-10da-4ada-8727-8bd6a0f608e0",
        "scripts_cache": "9701008d-c511-4ded-94b3-b08748a6e066"
    });
    //setup server
    mock_store.dispatch({type: 'RESET_STORE'});
    set_address("test_server/");
    set_redis_store(mock_store);
    return refresh_caches().then((res)=>{
        check_test_results(initial_redux_state); 
    });
})

test("soft_load", () => {
    localStorage.clear();
    localStorage.initialize({
        "peripheral_cache": "94c3d594-3bb9-4fae-b6aa-a61e03a288e2",
        "application_cache": "9bc23e2d-dc4c-44cb-be5d-3897f288c617",
        "bitstreams_cache": "74472cc1-fdb7-486a-975c-129c71400530",
        "programs_cache": "d0f8e19-10da-4ada-8727-8bd6a0f608e0",
        "scripts_cache": "9701028d-c511-4ded-94b3-b08748a6e066"
    });
    //setup server
    mock_store.dispatch({type: 'RESET_STORE'});
    set_address("test_server/");
    set_redis_store(mock_store);
    return refresh_caches().then((res)=>{
        let redux_reference = {
            "applications":[{application_obj:true}],
            "peripherals":[{peripheral_obj:true}],
            "scripts":[{scripts_obj:true}],
            "bitstreams":[{bitstream_obj:true}],
            "programs":[{programs_obj:true}]
        }
        check_test_results(redux_reference); 
    });
})
