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




import {store} from "../index";
import {backend_get, backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {addPeripheral, removePeripheral} from "../../redux/Actions/peripheralsActions";
import {up_register} from "./up_register";

export class up_peripheral {
    constructor(periph_data_obj) {
        if(!periph_data_obj)
            return null;

        this.peripheral_name = periph_data_obj.peripheral_name;
        this.version = periph_data_obj.version;
        this.registers = [];
        for(const item of periph_data_obj.registers){
            this.registers.push(new up_register(item, periph_data_obj.peripheral_name));
        }
    }

    static construct_empty(periph_name){
        let periph_data_obj = {peripheral_name:periph_name, version:0.1, registers:[]};
        return new up_peripheral(periph_data_obj);
    }

    add_remote = () => {
        store.dispatch(addPeripheral({payload:{[this.peripheral_name]:this}}))
        return backend_post(api_dictionary.peripherals.add, {payload:this._get_periph()});
    }

    add_register = (reg_name) =>{
        let reg = up_register.construct_empty(reg_name, this.peripheral_name);
        this.registers.push(reg);
        store.dispatch(addPeripheral({payload:{[this.peripheral_name]:this}}));
        let edit ={peripheral:this.peripheral_name, action:"add_register",register:reg._get_register()};
        return backend_post(api_dictionary.peripherals.edit, edit);
    }

    set_version = (ver) =>{
        this.version = ver;
        let edit ={peripheral:this.peripheral_name, action:"edit_version", version:parseFloat(ver)};
        store.dispatch(addPeripheral({payload:{[this.peripheral_name]:this}}))
        return backend_post(api_dictionary.peripherals.edit, edit);
    };

    edit_name = (name) =>{

    };

    static delete_periperal(periph){
        return backend_get(api_dictionary.peripherals.delete+'/'+ periph).then(()=>{
            store.dispatch(removePeripheral(periph));
        })
    }

    static bulk_register_write(data){
        return backend_post(api_dictionary.peripherals.bulk_write, data);
    }

    _get_periph = () =>{
        let cleaned_registers = [];
        for(let i of this.registers){
            cleaned_registers.push(i._get_register());
        }
        return {[this.peripheral_name]:{
            peripheral_name:this.peripheral_name,
            version:this.version,
            registers:cleaned_registers
        }};
    }
}
