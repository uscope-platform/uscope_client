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

import type {up_peripheral} from "#client_core/index.js";

/// The specification a peripheral of an application refers to. The applications exported by ananke name the
/// specification (the module type), the ones saved by the client and the older files hold its numeric id, the ids of
/// two exports are unrelated, so both forms are accepted and the name is what survives an import
export const find_peripheral_spec = (
    peripherals: Record<number, up_peripheral>,
    spec_id: string | number
): up_peripheral | undefined => {
    const key = String(spec_id);
    if(key === "") return undefined;
    const specs = Object.values(peripherals);
    if(/^\d+$/.test(key)){
        return specs.find(p => p.id === parseInt(key));
    }
    return specs.find(p => p.name === key);
};
