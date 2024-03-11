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

import {refresh_caches} from "../../src/client_core";
import {mock_store, initial_redux_state} from "./mock/redux_store";
import {
    applications_init,
    bitstream_init,
    peripherals_init,
    programs_init,
    scripts_init,
    filters_init, emulators_init
} from "./mock/cache_handling_api";

let check_test_results = (promise_result, redux_reference, test_case) => {
    expect(promise_result[0].status).toBe(test_case)
    expect(promise_result[1].status).toBe(test_case)
    expect(promise_result[2].status).toBe(test_case)
    expect(promise_result[3].status).toBe(test_case)
    expect(promise_result[4].status).toBe(test_case)
    expect(promise_result[5].status).toBe(test_case)
    expect(promise_result[6].status).toBe(test_case)

    let state = mock_store.getState();

    expect(localStorage.getItem("application_cache")).toBe("9bcb1e2d-dc4c-44cb-be5d-3897f288c617");
    expect(localStorage.getItem("peripheral_cache")).toBe("94c46594-3bb9-4fae-b6aa-a61e03a288e2");
    expect(localStorage.getItem("bitstreams_cache")).toBe("74478cc1-fdb7-486a-975c-129c71400530");
    expect(localStorage.getItem("programs_cache")).toBe("d0f84519-10da-4ada-8727-8bd6a0f608e0");
    expect(localStorage.getItem("scripts_cache")).toBe("9701008d-c511-4ded-94b3-b08748a6e066");
    expect(localStorage.getItem("filters_cache")).toBe("56dd465c-2aa3-46dc-ab05-db35e217f801");
    expect(localStorage.getItem("emulators_cache")).toBe("9d80a6f8-9e9a-46ca-b3bf-8203b5c8a010");

    expect(state.applications).toMatchObject(redux_reference.applications);
    expect(state.applications["SicDrive"].constructor.name).toBe("up_application");

    expect(state.peripherals).toMatchObject(redux_reference.peripherals);
    expect(state.peripherals['ADC_processing'].constructor.name).toBe("up_peripheral");

    expect(state.scripts).toMatchObject(redux_reference.scripts);
    expect(state.scripts[1].constructor.name).toBe("up_script");

    expect(state.bitstreams).toMatchObject(redux_reference.bitstreams);
    expect(state.bitstreams[1].constructor.name).toBe("up_bitstream");

    expect(state.programs).toMatchObject(redux_reference.programs);
    expect(state.programs[1].constructor.name).toBe("up_program");

    expect(state.filters).toMatchObject(redux_reference.filters);
    expect(state.filters[1].constructor.name).toBe("up_filter");

    expect(state.emulators).toMatchObject(redux_reference.emulators)
    expect(state.emulators[1].constructor.name).toBe("up_emulator");
}

const expected_store = {
    "applications":applications_init,
    "peripherals":peripherals_init,
    "scripts":scripts_init,
    "bitstreams":bitstream_init,
    "programs":programs_init,
    "filters": filters_init,
    "emulators":emulators_init
}


test("hard_load", () => {
    localStorage.clear();
    return refresh_caches().then((res)=>{
        check_test_results(res, expected_store, "hard_load");
    });
})



test("valid", () => {
    localStorage.clear();

    localStorage.setItem("peripheral_cache", "94c46594-3bb9-4fae-b6aa-a61e03a288e2")
    localStorage.setItem("application_cache", "9bcb1e2d-dc4c-44cb-be5d-3897f288c617")
    localStorage.setItem("bitstreams_cache", "74478cc1-fdb7-486a-975c-129c71400530")
    localStorage.setItem("programs_cache", "d0f84519-10da-4ada-8727-8bd6a0f608e0")
    localStorage.setItem("scripts_cache", "9701008d-c511-4ded-94b3-b08748a6e066")
    localStorage.setItem("filters_cache", "56dd465c-2aa3-46dc-ab05-db35e217f801")
    localStorage.setItem("emulators_cache", "9d80a6f8-9e9a-46ca-b3bf-8203b5c8a010")

    //setup server
    mock_store.dispatch({type: 'RESET_STORE'});
    return refresh_caches().then((res)=>{
        check_test_results(res, initial_redux_state, "valid");
    });
})

test("refresh", () => {
    localStorage.clear();

    localStorage.setItem("peripheral_cache", "94c3d594-3bb9-4fae-b6aa-a61e03a288e2")
    localStorage.setItem("application_cache", "9bc23e2d-dc4c-44cb-be5d-3897f288c617")
    localStorage.setItem("bitstreams_cache", "74472cc1-fdb7-486a-975c-129c71400530")
    localStorage.setItem("programs_cache", "d0f8e19-10da-4ada-8727-8bd6a0f608e0")
    localStorage.setItem("scripts_cache", "9701028d-c511-4ded-94b3-b08748a6e066")
    localStorage.setItem("filters_cache", "56dd65c-2aa3-46dc-ab05-db35e217f801")
    localStorage.setItem("emulators_cache", "9d80a68-9e9a-46ca-b3bf-8203b5c8a010")

    //setup server
    mock_store.dispatch({type: 'RESET_STORE'});
    return refresh_caches().then((res)=>{
        check_test_results(res, expected_store, "refresh");
    });
})
