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
import {loadPeripherals} from "../../redux/Actions/peripheralsActions";
import store from "../../store";
import {sendRegister} from "../../redux/Actions/RegisterActions";


export const get_peripherals_hash = () =>{
    return backend_get('registers/digest')
};

export const load_all_peripherals = () => {
    return dispatch_redux_thunk(loadPeripherals,'registers/all_peripheral/descriptions');
}


export const get_peripheral_registers =  (peripheral_name) => {
    return backend_get('registers/'+peripheral_name+'/descriptions');
};

export const bulk_register_write = (registers) =>{
    return backend_post('registers/bulk_write', registers);
};

export const set_register_value = (register) => {
    return dispatch_redux_thunk(sendRegister, 'registers/'+register.peripheral+'/value', register);
};