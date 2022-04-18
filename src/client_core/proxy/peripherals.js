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


import {backend_get, dispatch_redux_thunk_get} from "./backend";
import {loadPeripherals} from "../../redux/Actions/peripheralsActions";


export const get_peripherals_hash = () =>{
    return backend_get('registers/digest')
};

export const load_all_peripherals = () => {
    dispatch_redux_thunk_get(loadPeripherals,'registers/all_peripheral/descriptions');
}
