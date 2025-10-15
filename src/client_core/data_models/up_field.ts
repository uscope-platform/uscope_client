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


import store from "../../store.js";
import {removeField, upsertField} from "#redux/index.js";
import {backend_patch} from "../proxy/backend.js";
import {api_dictionary} from "../proxy/api_dictionary.js";
import type {field} from "#interfaces/index.ts";

export class up_field {
    public name:string;
    public parent_register: string;
    public parent_peripheral: number;
    public description: string;
    public length: number;
    public offset: number;
    public order: number;
    public n_fields: string[];

    constructor(field_obj: field, parent_r: string, parent_p: number) {
        this.name = field_obj.name;
        this.parent_register = parent_r;
        this.parent_peripheral = parent_p;
        this.description = field_obj.description;
        this.length = field_obj.length;
        this.offset = field_obj.offset;
        this.n_fields = field_obj.n_fields;
        this.order = field_obj.order;
    }

    static construct_empty(field_name: string, parent_r: string, parent_p: number): up_field{

        let field_obj;
        field_obj = {name:field_name, description:"", length:1,  offset:0, order:0, n_fields:[]};

        return new up_field(field_obj, parent_r, parent_p);
    }

    edit_name = async (name: string) =>{
        let old_name = JSON.parse(JSON.stringify(this.name));
        this.name = name;
        let edit = {peripheral:this.parent_peripheral, field:"field", action:"remove", value: {id:this.parent_register, object: old_name}};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_peripheral, edit)
        edit = {peripheral:this.parent_peripheral, field:"field", action:"add", value:{id:this.parent_register, object: this._get_field()}};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_peripheral, edit)
        store.dispatch(upsertField( {name: old_name, obj:this}));
    }

    edit_description = async (description: string) =>{
        this.description = description;
        return this.push_edit();
    };

    edit_length =async (length: number) => {
        this.length = length;
        return this.push_edit();
    }

    edit_order = async (order: number) => {
        this.order = order;
        return this.push_edit();
    }

    edit_n_fields = async (n_fields: string) => {
        this.n_fields = [n_fields];
        return this.push_edit();

    }
    edit_offset =async (offset: number) => {
        this.offset = offset;
        return this.push_edit();
    }


    push_edit = async () =>{
        let edit = {peripheral:this.parent_peripheral, field:"field", action:"edit", value: {id:this.parent_register, object: this._get_field()}};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_peripheral, edit)
        return store.dispatch(upsertField({name: this.name, obj:this}));
    }

    static async remove_field(periph: number, reg: string, field: string){

        let edit = {peripheral:periph, field:"field", action:"remove", value: {id:reg, object: field}};
        console.log(edit);
        await backend_patch(api_dictionary.peripherals.edit+ '/' + periph, edit);
        return store.dispatch(removeField({periph:periph, reg:reg, field:field}));
    }

    _get_field = () => {
        let ret : field = {
            name: this.name,
            description: this.description,
            length: this.length,
            offset: this.offset,
            order: this.order,
            n_fields: this.n_fields,
        }
        return ret;
    }
}
