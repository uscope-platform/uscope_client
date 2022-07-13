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


export let write_callback = null;

export const set_write_callback = (callback) => {
    write_callback = callback;
}
const register_proxy = {
    set(obj, prop, value) {
        let access_type = null;
        if (prop==='value'){
            access_type = "full_reg";
        } else if(prop in obj){
            access_type = "field"
        } else {
            return false;
        }
        obj[prop] = value;
        if(write_callback) write_callback(obj["peripheral_id"], obj["peripheral_spec_id"], obj["register_id"], obj["field_specs"][prop], prop, access_type);
        return true;
    }
}

class fields_object {
    constructor(register, periph_id) {
        this["register_id"] = register.ID;
        this["peripheral_spec_id"] = register.parent_periph;
        this["peripheral_id"] = periph_id;
        this["field_specs"] = {}
        for(let item of register.fields){
            this[item.name] = 0;
            this.field_specs[item.name] = {length:item.length, offset:item.offset};
        }
    }
}


export const construct_proxied_register = (reg, periph_id) =>{
    let fields = new fields_object(reg, periph_id);
    return new Proxy(fields, register_proxy);
}