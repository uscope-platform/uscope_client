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

import {backend_get, backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";

export class up_settings {

    static set_debug_level(level){
        return backend_post(api_dictionary.settings.debug_level, {level:level});
    }

    static get_debug_level(){
        return backend_get(api_dictionary.settings.debug_level);
    }

    static get_hil_address_map() {
        return backend_get(api_dictionary.settings.hil_address_map);
    }

    static set_hil_address_map(map) {
        return backend_post(api_dictionary.settings.hil_address_map, map);
    }

    static initialize_default_driver_address_map() {
       return backend_post(api_dictionary.settings.hil_address_map, {
            "bases": {
                "controller": 18316591104,
                "cores_control": 18316656640,
                "cores_inputs": 8192,
                "cores_rom": 21474836480,
                "hil_control": 18316525568,
                "scope_mux": 18316853248
            },
            "offsets": {
                "controller": 4096,
                "cores_control": 65536,
                "dma": 4096,
                "cores_inputs": 4096,
                "cores_rom": 268435456,
                "hil_tb": 0
            }
        })
    }
}