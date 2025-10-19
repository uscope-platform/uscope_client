// Copyright 2024 Filippo Savi
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

import {backend_get, backend_post} from "../proxy/backend.js";
import {api_dictionary} from "../proxy/api_dictionary.js";
import type {hil_address_map} from "#interfaces/index.ts";

export class up_settings {

    static set_debug_level(level:string){
        return backend_post(api_dictionary.settings.debug_level, {level:level});
    }

    static get_debug_level(){
        return backend_get(api_dictionary.settings.debug_level);
    }

    static get_hil_address_map() {
        return backend_get(api_dictionary.settings.hil_address_map);
    }

    static set_hil_address_map(map: hil_address_map) {
        return backend_post(api_dictionary.settings.hil_address_map, map);
    }

    static get_debugger_option(option_name :string){
        return backend_get(api_dictionary.settings.debugger_option + "/" + option_name);
    }

    static set_debugger_option(option_name: string, value: boolean){
        return backend_post(api_dictionary.settings.debugger_option+ "/" + option_name, {"name": option_name, "value": value});
    }

    static initialize_default_driver_address_map() {
       return backend_post(api_dictionary.settings.hil_address_map, {
            "bases": {
                "scope_mux":     0x443C00000,
                "controller":    0x443C10000,
                "hil_control":   0x443C20000,
                "noise_generator":     0x443c30000,
                "waveform_generator":     0x443c40000,
                "cores_control": 0x443c50000,
                "cores_inputs": 0x2000,
                "cores_rom": 0x500000000,
            },
            "offsets": {
                "controller": 0x1000,
                "cores_control": 0x10000,
                "dma": 0x1000,
                "cores_inputs": 0x1000,
                "cores_rom": 0x10000000,
                "hil_tb": 0
            }
        })
    }
}
