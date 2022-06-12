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
import {up_field} from "./up_field";
import {backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {upsertRegister} from "../../redux/Actions/peripheralsActions";

export class up_register {
    constructor(register_obj, parent_periph) {
        this.parent_periph = parent_periph;
        this.ID = register_obj.ID;
        this.register_name = register_obj.register_name;
        this.description = register_obj.description;
        this.direction = register_obj.direction;
        this.offset= register_obj.offset;
        this.value = register_obj.value;
        this.fields = [];
        for(const item of register_obj.fields){
            this.fields.push(new up_field(item));
        }
    }

    static construct_empty(register_name, parent_periph){
        let register_obj = {ID:register_name.replace(/\s/g, "_").toLowerCase(), register_name:register_name,
            description:"", direction:"", offset:"0x0", value:0, fields: []};
        return new up_register(register_obj, parent_periph);
    }

    set_id = (id) =>{
        this.ID = id
    }

    set_name = (name) =>{
        this.register_name = name;
    };

    set_description = (descr) => {
        this.description = descr;
    }

    set_direction = (dir) => {
        this.direction = dir
    }

    set_offset = (offset) => {
        this.offset = offset;
    }

    set_fields = (fields) => {
        this.fields = fields;
    }

    edit_name = (name) =>{
        let edit = {peripheral:this.parent_periph, register:this.register_name, field:"register_name", value:name, action:"edit_register"};
        this.register_name = name;
        store.dispatch(upsertRegister(this, this.ID, this.parent_periph));
        return backend_post(api_dictionary.peripherals.edit, edit)
    };

    edit_direction = (direction) =>{

    }

    add_field = (field) => {
        this.fields.push(field);
    }

    _get_register = () => {
        let converted_fields = [];
        for(let i of this.fields){
            converted_fields.push(i._get_field());
        }
        return{
            "ID": this.ID,
            "register_name": this.register_name,
            "description": this.description,
            "fields": converted_fields,
            "direction": this.direction,
            "offset": this.offset,
            "value": this.value,
        }
    }
}
