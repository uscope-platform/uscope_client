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

import {latest_scope_data, scope_command, subscribe_scope_frames} from "./scope_stream.js";
import type {scope_control, scope_data_object, scope_settings, ScopeStatus} from "#interfaces/index.js";


export const direct_fetch = (): Promise<scope_data_object[]> =>  {
    return Promise.resolve(latest_scope_data());
};

export {subscribe_scope_frames};

export const set_scaling_factors = (scaling_factors: number[]) => {
    return scope_command("set_scaling_factors", scaling_factors).catch((err) => {
        alert('ERROR: error while setting up channel scaling factors\n' + err.message);
        throw err;
    });
}

export let get_acquisition_status = (): Promise<ScopeStatus> =>{
    return scope_command<ScopeStatus>("get_acquisition_status");
}

export let set_acquisition = (args: scope_control) =>{
    return scope_command("set_acquisition", args);
}

export let set_scope_address  = (args: scope_settings) =>{
    return scope_command("set_scope_address", args);
}

export let set_scope_dma_disable = (status: boolean) =>{
    return scope_command("disable_scope_dma", {status: status});
}
