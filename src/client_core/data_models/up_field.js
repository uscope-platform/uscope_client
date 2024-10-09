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
import {removeField, upsertField} from "../../redux/Actions/peripheralsActions";
import {backend_patch} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";

export class up_field {
    constructor(field_obj, parent_r, parent_p, parametric) {
        this.name = field_obj.name;
        this.parent_register = parent_r;
        this.parent_peripheral = parent_p;
        this.description = field_obj.description;
        this.length = field_obj.length;
        this.offset = field_obj.offset;
        this.parametric = parametric;
        if(parametric){
            this.n_fields = field_obj.n_fields;
            this.order = field_obj.order;
        }
    }

    static construct_empty(field_name, parent_r, parent_p, parametric){

        let field_obj;
        if(parametric){
            field_obj = {name:field_name, description:"", length:1,  offset:0, order:0, n_fields:[]};
        } else{
            field_obj = {name:field_name, description:"", length:1,  offset:0};
        }

        return new up_field(field_obj, parent_r, parent_p, parametric);
    }

    edit_name = async (name) =>{
        let old_name = JSON.parse(JSON.stringify(this.name));
        this.name = name;
        let edit = {peripheral:this.parent_peripheral, field:"field", action:"remove", value: {id:this.parent_register, object: old_name}};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_peripheral, edit)
        edit = {peripheral:this.parent_peripheral, field:"field", action:"add", value:{id:this.parent_register, object: this._get_field()}};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_peripheral, edit)
        return store.dispatch(upsertField(this, old_name, this.parent_register, this.parent_peripheral));
    }

    edit_description = async (description) =>{
        this.description = description;
        return this.push_edit();
    };

    edit_length =async (length) => {
        this.length = length;
        return this.push_edit();
    }

    edit_order = async (order) => {
        this.order = order;
        return this.push_edit();
    }

    edit_n_fields = async (n_fields) => {
        this.n_fields = [n_fields];
        return this.push_edit();

    }
    edit_offset =async (offset) => {
        this.offset = offset;
        return this.push_edit();
    }


    push_edit = async () =>{
        let edit = {peripheral:this.parent_peripheral, field:"field", action:"edit", value: {id:this.parent_register, object: this._get_field()}};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_peripheral, edit)
        return store.dispatch(upsertField(this, this.name, this.parent_register, this.parent_peripheral));
    }

    static async remove_field(periph, reg, field){

        let edit = {peripheral:periph, field:"field", action:"remove", value: {id:reg, object: field}};
        console.log(edit);
        await backend_patch(api_dictionary.peripherals.edit+ '/' + periph, edit);
        return store.dispatch(removeField(periph, reg, field));
    }

    _get_field = () => {
        let ret = {
            "name": this.name,
            "description": this.description,
            "length": this.length,
            "offset": this.offset
        }
        if(this.parametric){
            ret["order"] = this.order;
            ret["n_fields"] = this.n_fields;
        }
        return ret;
    }
}
