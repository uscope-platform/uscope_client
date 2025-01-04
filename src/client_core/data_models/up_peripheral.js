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

import {construct_proxied_register, store} from "../index";
import {backend_delete, backend_get, backend_patch, backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {addPeripheral, removePeripheral} from "@redux";
import {up_register} from "@client_core";

export class up_peripheral {

    constructor(periph_data_obj) {
        if(!periph_data_obj)
            return null;

        this.id = periph_data_obj.id;
        this.name = periph_data_obj.name;
        this.version = periph_data_obj.version;
        this.parametric = periph_data_obj.parametric;
        this.registers = [];
        for(const item of periph_data_obj.registers){
            this.registers.push(new up_register(item, periph_data_obj.id, this.parametric));
        }
    }

    static construct_empty(periph_id){
        let periph_data_obj = {
            id:periph_id,
            name: 'new peripheral_' + periph_id,
            version:0.1,
            registers:[],
            parametric:false
        };
        return new up_peripheral(periph_data_obj);
    }


    get_register_names = (parameters) =>{
        return this.registers.map((reg) =>{
            if(this.parametric) {
                let n_regs;
                if(parameters[reg.n_registers[0]]){
                    n_regs = parseInt(parameters[reg.n_registers[0]]);
                } else {
                    n_regs = parseInt(reg.n_registers[0]);
                }
                let ret = [];
                for(let i = 0; i<n_regs; i++){
                    ret.push(reg.register_name.replace("$", i));
                }
                return ret;
            } else {
                return reg.register_name;
            }
        })
    }

    static get_filter_peripherals(){
        return ["AdcProcessing"];
    }

    add_remote = async () => {
        let resp = await backend_post(api_dictionary.peripherals.add, this._get_periph()[this.name]);
        store.dispatch(addPeripheral({payload:{[this.id]:this}}));
        return resp;
    }

    add_register = async (reg_name) =>{
        let reg = up_register.construct_empty(reg_name, this.id, this.parametric);
        let edit = {peripheral:this.id, field:"register", action:"add", value:reg._get_register()};
        await backend_patch(api_dictionary.peripherals.edit + '/' + this.id, edit);
        this.registers.push(reg);
        return store.dispatch(addPeripheral({payload:{[this.id]:this}}));
    }

    set_version = async (ver) =>{
        this.version = ver;
        let edit ={peripheral:this.id, field:"version", action:"edit", value:parseFloat(ver)};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.id, edit);
        return store.dispatch(addPeripheral({payload:{[this.id]:this}}))

    };

    edit_name = async (name) =>{
        this.name = name;
        let edit ={peripheral:this.id, field:"name", action:"edit", value:name};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.id, edit);
        await store.dispatch(removePeripheral(this.id))
        return  store.dispatch(addPeripheral({payload:{[this.id]:this}}))
    };

    edit_parametric = async (value) =>{
        this.parametric = value;
        let edit ={peripheral:this.id, field:"parametric", action:"edit",  value:value};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.id, edit);
        return store.dispatch(addPeripheral({payload:{[this.id]:this}}))
    };

    get_register_offset = (name, parameters) =>{
        if(this.parametric){
            let current_address_offset = 0;
            for (const r of this.registers) {
                let n_registers;
                if(parameters[r.n_registers[0]]){
                    n_registers = parameters[r.n_registers[0]];
                } else {
                    n_registers = parseInt(r.n_registers[0]);
                }
                for(let i = 0; i<n_registers;i++){
                    let current_name = r.register_name.replace("$", i);
                    if(name === current_name) return current_address_offset
                    current_address_offset +=4;
                }
            }
        } else {
            let offset = this.registers.filter((item)=>{
                return item.register_name === name
            })[0].offset;
            return parseInt(offset);
        }

    }


    get_proxied_registers = (periph_id, parameters) =>{
        let registers = {}

        if(this.parametric){
            let current_address_offset = 0;
            for (const r of this.registers) {
                let n_registers;
                if(parameters[r.n_registers[0]]){
                    n_registers = parameters[r.n_registers[0]];
                } else {
                    n_registers = parseInt(r.n_registers[0]);
                }
                for(let i = 0; i<n_registers;i++){
                    current_address_offset +=4;
                    let local_r = JSON.parse(JSON.stringify(r));
                    local_r.offset = current_address_offset;
                    local_r.ID = local_r.ID.replace("$", i);
                    local_r.register_name = local_r.register_name.replace("$", i);

                    let current_field_offset = 0;
                    let fields = [];
                    for(let f of local_r.fields){
                        let n_fields;
                        if(parameters[f.n_fields[0]]){
                            n_fields = parameters[f.n_fields[0]];
                        } else {
                            n_fields = parseInt(f.n_fields[0]);
                        }

                        for(let j = 0; j<n_fields; j++){
                            let local_f= JSON.parse(JSON.stringify(f));
                            // calculate starting point
                            local_f.offset = current_field_offset;
                            current_field_offset +=f.length;
                            local_f.name = local_f.name.replace("$", j);
                            fields.push(local_f);
                        }

                    }
                    local_r.fields = fields;
                    registers[local_r.ID] = construct_proxied_register(local_r, periph_id);
                }
            }
        } else {
            for (const r of this.registers) {
                registers[r.ID] = construct_proxied_register(r, periph_id);
            }
        }



        return registers;
    }

    static delete(periph){
        return backend_delete(api_dictionary.peripherals.delete+'/'+ periph.id).then(()=>{
            store.dispatch(removePeripheral(periph.id));
        })
    }

    static bulk_register_write(data){
        return backend_post(api_dictionary.operations.write_registers, data);
    }

    static direct_register_write(writes){
        let payload = []
        for (const item of writes) {
           payload.push({type:"direct", proxy_type:"", proxy_address:0, address:item[0], value:item[1]})
        }
        return up_peripheral.bulk_register_write(payload);
    }

    static direct_register_read(address){
        return backend_get(api_dictionary.operations.read_register + '/' +address);
    }

    get_raw_obj = () => {
        return this._get_periph();
    }

    _get_periph = () =>{
        let cleaned_registers = [];
        for(let i of this.registers){
            cleaned_registers.push(i._get_register());
        }
        return {[this.name]:{
            id:this.id,
            name:this.name,
            version:this.version,
            parametric:this.parametric,
            registers:cleaned_registers
        }};
    }
}
