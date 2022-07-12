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

export const translate_legacy_registers = (store, registers) => {
    const state = store.getState();
    const app_peripherals = state.applications[state.settings['application']]['peripherals'];
    const peripherals_specs = state.peripherals;


    let bulk_registers = [];
    for (let reg in registers) {
        let [periph_id, reg_id] = reg.split('.');
        let periph = app_peripherals.filter((periph) => {
            return periph.peripheral_id === periph_id;
        })[0];
        let reg_offset = peripherals_specs[periph.spec_id].registers.filter((reg) => {
            return reg.ID === reg_id;
        })[0].offset;
        let address = parseInt(periph.base_address) + parseInt(reg_offset);
        if (periph.proxied) {
            bulk_registers.push({type:"proxied", proxy_type:periph.proxy_type, proxy_address:parseInt(periph.proxy_address), address:address, value:registers[reg]})
        } else {
            bulk_registers.push({type:"direct", proxy_type:"", proxy_address:0, address:address, value:registers[reg]})
        }

    }



    return bulk_registers;
};


export const translate_registers = (write_log, peripherals) =>{
    let writes = []

    for(let item of write_log){

        let periph = peripherals[item.periph_id].periph_obj

        let base_addr = parseInt(periph.base_address)
        let register_offset = parseInt(peripherals[item.periph_id].spec_obj.registers.filter((reg)=>{
            return reg.ID === item.reg_id;
        })[0].offset)
        let address = base_addr + register_offset;
        let value = null;
        if(item.access_type === "full_reg"){
            value = peripherals[item.periph_id].regs[item.reg_id].full_register_value;
        } else if(item.access_type === "field"){
            value = [];
            for(let field in peripherals[item.periph_id].regs[item.reg_id].fields_masks) {
                value.push({value:peripherals[item.periph_id].regs[item.reg_id][field], mask:peripherals[item.periph_id].regs[item.reg_id].fields_masks[field]})
            }
        } else {
            throw new Error('Unrecognised register access type');
        }



        if(periph.proxied){
            writes.push({type:"proxied", proxy_type:periph.proxy_type, proxy_address:parseInt(periph.proxy_address), address:address, value:value})
        } else {
            writes.push({type:"direct", proxy_type:"", proxy_address:0, address:address, value:value})
        }

    }
    return writes;
}

