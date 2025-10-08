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
import {backend_patch} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import { removeRegister, upsertRegister} from "#redux";

export class up_register {
    constructor(register_obj, parent_periph, parametric) {

        this.parent_periph = parent_periph;
        this.ID = register_obj.ID;
        this.register_name = register_obj.register_name;
        this.description = register_obj.description;
        this.direction = register_obj.direction;
        this.value = register_obj.value;
        if(parametric){
            this.order = register_obj.order;
            this.n_registers = register_obj.n_registers;
        } else{
            this.offset= register_obj.offset;
        }
        this.parametric = parametric;
        this.fields = [];
        for(const item of register_obj.fields){
            this.fields.push(new up_field(item, this.register_name, parent_periph, parametric));
        }
    }

    get_field_names = (parameters)=>{
        return this.fields.map((field)=>{
            if(this.parametric){
                let n_fields;
                if(parameters[field.n_fields[0]]){
                    n_fields = parseInt(parameters[field.n_fields[0]]);
                } else {
                    n_fields = parseInt(field.n_fields[0]);
                }
                let ret = [];
                for(let i = 0; i<n_fields; i++){
                    ret.push(field.name.replace("$", i));
                }
                return ret;
            } else {
                return field.name;
            }
        })
    }

    static construct_empty(register_name, parent_periph, parametric){
        let register_obj;
        if(parametric){
             register_obj = {
                 ID:register_name.replace(/\s/g, "_").toLowerCase(),
                 register_name:register_name,
                 description:"",
                 direction:"",
                 order:0,
                 n_registers:[],
                 value:0,
                 fields: []
             };
        } else{
            register_obj = {
                ID:register_name.replace(/\s/g, "_").toLowerCase(),
                register_name:register_name,
                description:"",
                direction:"",
                offset:"0x0",
                value:0,
                fields: []
            };
        }

        return new up_register(register_obj, parent_periph, parametric);
    }

    edit_description = async (descr) => {
        this.description = descr;
        return this.push_edit();
    }

    edit_name = async (name) =>{

        this.register_name = name;
        return this.push_edit();
    };

    edit_direction = async (raw_direction) =>{
        let direction = "";
        switch (raw_direction.name) {
            case "direction_read":
                if(raw_direction.checked){
                    if(this.direction.includes("W")){
                        direction = "R/W"
                    }else{
                        direction = "R"
                    }
                } else{
                    if(this.direction.includes("W")){
                        direction = "W"
                    }else{
                        direction = ""
                    }
                }
                break;
            case "direction_write":
                if(raw_direction.checked){
                    if(this.direction.includes("R")){
                        direction = "R/W"
                    }else{
                        direction = "W"
                    }
                } else{
                    if(this.direction.includes("R")){
                        direction = "R"
                    }else{
                        direction = ""
                    }
                }
                break;
            default:
                return;
        }
        this.direction = direction;
        return this.push_edit();

    }

    edit_offset = async (offset) => {
        this.offset = offset;
        return this.push_edit();
    }
    edit_order = async (order) => {
        this.order = order;
        return this.push_edit();
    }

    edit_n_registers = async (value) => {
        this.n_registers = [value];
        return this.push_edit();
    }

    edit_id = async (id) =>{
        let old_id = this.ID;
        this.ID = id;
        let edit = {peripheral:this.parent_periph, field:"register", action:"remove", value:old_id};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_periph, edit)
        edit = {peripheral:this.parent_periph, field:"register", action:"add", value:this._get_register()};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_periph, edit)
        return store.dispatch(upsertRegister({id:old_id, obj:this}));
    }

    push_edit = async () =>{
        let edit = {peripheral:this.parent_periph, field:"register", action:"edit", value:this._get_register()};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_periph, edit)
        return store.dispatch(upsertRegister({id:this.ID, obj:this}));
    }

    set_fields = (fields) => {
        this.fields = fields;
    }

    add_field = (field) => {
        this.fields.push(field);
    }

    static async remove_register(periph, reg){
        let edit = {peripheral:periph, field:"register", action:"remove", value:reg};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + periph, edit)

        return store.dispatch(removeRegister({periph:periph, reg:reg}));
    }

    get_fields_names = () => {
        let f_names = []
        for (const f of this.fields) {
            f_names.push(f.name)
        }
        return f_names
    }

    get_raw_obj = () => {
        return this._get_register();
    }


    _get_register = () => {
        let converted_fields = [];
        for(let i of this.fields){
            converted_fields.push(i._get_field());
        }
        let ret_obj ={
            "ID": this.ID,
            "register_name": this.register_name,
            "description": this.description,
            "fields": converted_fields,
            "direction": this.direction,
            "value": this.value
        }

        if(this.parametric){
            ret_obj["order"] = this.order;
            ret_obj["n_registers"] = this.n_registers;
        } else {
            ret_obj["offset"]  = this.offset;
        }

        return ret_obj;
    }
}
