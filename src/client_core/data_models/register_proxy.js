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


const register_proxy = {
    set(obj, prop, value) {
        if (prop==='value'){
            obj['full_register_accessed'] = true;
            obj['full_register_value'] = value;
        } else if(prop in obj){
            obj[prop] = value;
        } else {
            return false;
        }
        return true;
    }
}

class fields_object {
    constructor(register) {
        this['fields_masks'] = {}
        this['full_register_accessed'] = false;
        this['full_register_value'] = 0;
        for(let item of register.fields){
            this[item.name] = 0;
            this['fields_masks'][item.name] = ((1<<item.length)-1<<item.offset)>>>0;
        }
    }
}


export const construct_proxied_register = (reg) =>{
    let fields = new fields_object(reg);
    return new Proxy(fields, register_proxy);
}