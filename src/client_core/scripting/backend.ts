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

import {up_peripheral} from "#client_core/index.js";
import type {autocomplete_periph_object, register_write_object} from "#interfaces/scripting/types.js";
import type {register_write} from "#interfaces/proxy/types.js";

export const translate_registers = (
    write_log: register_write_object[], peripherals: Record<string, autocomplete_periph_object>
): register_write[] =>{
    let writes: any[] = []

    //The first step is the consolidation of informations scattered here and there
    for(let item of write_log){
        let raw_peripheral = peripherals[item.periph_id];
        if(raw_peripheral === undefined) {
            console.error("Peripheral not found" + item.periph_id);
            continue;
        }
        let periph = raw_peripheral.periph_obj
        let periph_spec = new up_peripheral(raw_peripheral.spec_obj);
        let base_addr = parseInt(periph.base_address)

        let register_offset = periph_spec.get_register_offset(item.reg_id, periph.hdl_parameters);
        if(register_offset === null) {
            console.error("Register not found" + item.reg_id);
            continue
        }
        let address = base_addr + register_offset;
        let value = null;
        let peripheral = peripherals[item.periph_id];
        if(peripheral === undefined) {
            console.error("Peripheral not found" + item.periph_id);
            continue;
        }
        let register = peripheral.regs[item.reg_id];
        if(register === undefined) {
            console.error("Register not found" + item.reg_id);
            continue;
        }

        if(item.access_type === "full_reg"){
            if(register.value === undefined) {
                console.error("Register Value must be defined for " + item.reg_id);
                continue;
            }
            value = register.value;
            delete register.value
        } else if(item.access_type === "field"){
            if(register[item.field_name] === undefined) {
                console.error("Register field not found" + item.field_name);
                continue;
            }
            value = {value:register[item.field_name], specs:item.field_spec};
        } else {
            throw new Error('Unrecognised register access type');
        }

        if(periph.proxied){
            writes.push({
                type:"proxied",
                access_type:item.access_type,
                proxy_type:periph.proxy_type,
                proxy_address:parseInt(periph.proxy_address),
                address:address,
                value: value
            })
        } else {
            writes.push({
                type:"direct",
                access_type:item.access_type,
                proxy_type:"",
                proxy_address:0,
                address:address,
                value: value
            })
        }
    }

    let completed_writes: register_write[] = []

    // In this step all the writes to fields of the same register are combined to a single masked write
    let register_writes: Record<number, number> = {}
    for(const w of writes) {
        if(w.access_type==="field")
            if(w.address in register_writes){
                let new_val = (((1<<w.value.specs.length)-1<<w.value.specs.offset)& (w.value.value<<w.value.specs.offset))>>>0;
                let old_val = register_writes[w.address];
                if(old_val == undefined) {
                    old_val= 0;
                }
                new_val = old_val|new_val;
                register_writes[w.address] = new_val;
            } else{
                register_writes[w.address] = (((1<<w.value.specs.length)-1<<w.value.specs.offset)& (w.value.value<<w.value.specs.offset))>>>0;
            }

    }

    let replaced_writes: Record<number, boolean> = {}
    for(let i = writes.length-1; i>=0; i--){
        let w: any = writes[i];
        if(w.address in register_writes){
            if(w.address in replaced_writes){
                writes.splice(i, 1);
            } else {
                writes[i] =  { type: "direct", proxy_type: "", proxy_address: 0, address: w.address, value: register_writes[w.address]};
                replaced_writes[w.address] = true;
            }
        } else {
            delete writes[i].access_type;
        }
    }
    for(let w of writes){
        completed_writes.push(w);
    }
    return completed_writes;
}

