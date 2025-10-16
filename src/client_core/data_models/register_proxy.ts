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


import type {up_register} from "#client_core/data_models/up_register.js";

type WriteCallback = (
    peripheral_id: number,
    peripheral_spec_id: number,
    register_id: string,
    field_spec: { length: number; offset: number } | undefined,
    prop: string | symbol,
    access_type: string
) => void;

export let write_callback: WriteCallback | null = null;

export const set_write_callback = (callback: WriteCallback) => {
    write_callback = callback;
}
const register_proxy: ProxyHandler<fields_object>  = {
    set(obj, prop, value) {
        let access_type = null;
        if (prop==='value'){
            access_type = "full_reg";
        } else if(prop in obj){
            access_type = "field"
        } else {
            return false;
        }
        (obj as any)[prop] = value;
        if(write_callback)
            write_callback(
                obj["peripheral_id"],
                obj["peripheral_spec_id"],
                obj["register_id"],
                obj["field_specs"][String(prop)],
                prop,
                access_type
            );
        return true;
    }
}

export class fields_object {
    public register_id: string;
    public peripheral_spec_id: number;
    public peripheral_id: number;
    public field_specs: Record<string, { length: number; offset: number }>;
    public value?: number;

    [key: string]: number | string | Record<string, { length: number; offset: number }> | undefined;

    constructor(register: up_register, periph_id: number) {
        this.register_id = register.ID;
        this.peripheral_spec_id = register.parent_periph;
        this.peripheral_id = periph_id;
        this.field_specs = {}
        for(let item of register.fields){
            this[item.name] = 0;
            this.field_specs[item.name] = {length:item.length, offset:item.offset};
        }
    }
}


export const construct_proxied_register = (reg:up_register, periph_id:number) : fields_object =>{
    let fields = new fields_object(reg, periph_id);
    return new Proxy(fields, register_proxy);
}