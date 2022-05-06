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
import {backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {addPeripheral} from "../../redux/Actions/peripheralsActions";
import {up_register} from "./up_register";

export class up_peripheral {
    constructor(periph_data_obj) {
        this.peripheral_name = periph_data_obj.peripheral_name;
        this.version = periph_data_obj.version;
        this.registers = [];
        for(const item of periph_data_obj.registers){
            this.registers.push(new up_register(item));
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
        let reg = up_register.construct_empty(reg_name);
        this.registers.push(reg);
        store.dispatch(addPeripheral({payload:{[this.peripheral_name]:this}}))
        let edit ={peripheral:this.peripheral_name, action:"add_register",register:reg};
        return backend_post(api_dictionary.peripherals.edit, edit);
    }

    edit_register = (register, field_name, field_value) =>{
        let edit = {peripheral:this.peripheral_name, register:register.register_name, field:field_name, value:field_value, action:"edit_register"};
        register[field_name] = field_value;
        return backend_post(api_dictionary.peripherals.edit, edit)
    }

    set_version = (ver) =>{
        this.version = ver;
        let edit ={peripheral:this.peripheral_name, action:"edit_version", version:parseFloat(ver)};
        store.dispatch(addPeripheral({payload:{[this.peripheral_name]:this}}))
        return backend_post(api_dictionary.peripherals.edit, edit);
    };

    edit_name = (name) =>{

    };

    remove_register = (reg_id) =>{
        let idx  = this.registers.indexOf(this.registers.filter((i) =>{
            return i.ID === reg_id;
        })[0]);
        this.registers.splice(idx,1);
        store.dispatch(addPeripheral({payload:{[this.peripheral_name]:this}}))
        let edit = {peripheral:this.peripheral_name, register:reg_id, action:"remove_register"};
        return backend_post(api_dictionary.peripherals.edit, edit);
    };

    _get_periph = () =>{
        return {[this.peripheral_name]:{
            peripheral_name:this.peripheral_name,
            version:this.version,
            registers:this.registers
        }};
    }
}
