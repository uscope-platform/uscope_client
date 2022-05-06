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


import {backend_get, backend_post, dispatch_redux_thunk} from "./backend";
import {
    loadPeripherals,
    removePeripheral
} from "../../redux/Actions/peripheralsActions";
import {sendRegister} from "../../redux/Actions/RegisterActions";

import {api_dictionary} from './api_dictionary'
import {store} from "../index";
import {up_peripheral} from "../data_models/up_peripheral";

export const get_peripherals_hash = () =>{
    return backend_get(api_dictionary.peripherals.get_hash)
};

export const load_all_peripherals = () => {
    return backend_get(api_dictionary.peripherals.load_all).then(res=>{
        let periph_dict = {}
        for (let item in res) {
            let periph = new up_peripheral(res[item])
            periph_dict[periph.peripheral_name] = periph
        }
        store.dispatch(loadPeripherals(periph_dict));
        return periph_dict;
    })

}

export const get_peripheral_registers =  (peripheral_name) => {
    return backend_get(api_dictionary.peripherals.get_registers(peripheral_name));
};

export const bulk_register_write = (registers) =>{
    return backend_post(api_dictionary.peripherals.bulk_write, registers);
};

export const set_register_value = (register) => {
    return dispatch_redux_thunk(sendRegister, api_dictionary.peripherals.set_register(register.peripheral), register);
};

export const remove_peripheral = (peripheral) => {
    return dispatch_redux_thunk(removePeripheral, api_dictionary.peripherals.delete+'/'+ peripheral, peripheral)
};
