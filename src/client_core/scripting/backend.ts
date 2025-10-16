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


export const translate_registers = (write_log: register_write_object[], peripherals: Record<string, autocomplete_periph_object>) =>{
    let writes = []

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

        let address = base_addr + register_offset;
        let value = null;
        if(item.access_type === "full_reg"){
            value = peripherals[item.periph_id].regs[item.reg_id].value;
            delete peripherals[item.periph_id].regs[item.reg_id].value
        } else if(item.access_type === "field"){
            value = [];
            value = {value:peripherals[item.periph_id].regs[item.reg_id][item.field_name], specs:item.field_spec};
        } else {
            throw new Error('Unrecognised register access type');
        }

        if(periph.proxied){
            writes.push({type:"proxied", access_type:item.access_type, proxy_type:periph.proxy_type, proxy_address:parseInt(periph.proxy_address), address:address, value:value})
        } else {
            writes.push({type:"direct", access_type:item.access_type, proxy_type:"", proxy_address:0, address:address, value:value})
        }

    }

    // In this step all the writes to fields of the same register are combined to a single masked write
    let register_writes = {}
    for(const w of writes) {
        if(w.access_type==="field")
            if(w.address in register_writes){
                let new_val = (((1<<w.value.specs.length)-1<<w.value.specs.offset)& (w.value.value<<w.value.specs.offset))>>>0;
                new_val = register_writes[w.address]|new_val;
                register_writes[w.address] = new_val;
            } else{
                register_writes[w.address] = (((1<<w.value.specs.length)-1<<w.value.specs.offset)& (w.value.value<<w.value.specs.offset))>>>0;
            }

    }

    let replaced_writes = {}
    for(let i = writes.length-1; i>=0; i--){
        if(writes[i].address in register_writes){
            if(writes[i].address in replaced_writes){
                writes.splice(i, 1);
            } else {
                writes[i] =  { type: "direct", proxy_type: "", proxy_address: 0, address: writes[i].address, value: register_writes[writes[i].address]};
                replaced_writes[writes[i].address] = true;
            }
        } else {
            delete writes[i].access_type;
        }
    }

    return writes;
}

