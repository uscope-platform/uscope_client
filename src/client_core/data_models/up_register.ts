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
import {up_field} from "./up_field.js";
import {backend_patch} from "../proxy/backend.js";
import {api_dictionary} from "../proxy/api_dictionary.js";
import { removeRegister, upsertRegister} from "#redux/index.js";
import type {register} from "#interfaces/index.ts";

export class up_register {
    public parent_periph: number;
    public ID: string;
    public register_name: string;
    public description: string;
    public direction: string;
    public value: number;
    public order: number;
    public n_registers: string[];
    public fields: up_field[];

    constructor(register_obj: register, parent_periph: number) {

        this.parent_periph = parent_periph;
        this.ID = register_obj.ID;
        this.register_name = register_obj.register_name;
        this.description = register_obj.description;
        this.direction = register_obj.direction;
        this.value = register_obj.value;
        this.order = register_obj.order;
        this.n_registers = register_obj.n_registers;
        this.fields = [];
        for(const item of register_obj.fields){
            this.fields.push(new up_field(item, this.register_name, parent_periph));
        }
    }

    get_field_names = (parameters: Record<string, number>)=>{
        return this.fields.map((field)=>{
            let n_fields;
            if(field.n_fields.length > 0){
                let n_f_expr = field.n_fields[0];
                if(!n_f_expr){
                    n_fields = 0;
                } else if(parameters[n_f_expr]){
                    n_fields = parameters[n_f_expr];
                } else {
                    n_fields = parseInt(n_f_expr);
                }
            } else {
                n_fields = 0
            }

            let ret = [];
            for(let i = 0; i<n_fields; i++){
                ret.push(field.name.replace("$", i.toString()));
            }
            return ret;
        })
    }

    static construct_empty(register_name: string, parent_periph: number){
        let register_obj;
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

        return new up_register(register_obj, parent_periph);
    }

    edit_description = async (descr: string) => {
        this.description = descr;
        return this.push_edit();
    }

    edit_name = async (name: string) =>{

        this.register_name = name;
        return this.push_edit();
    };

    edit_direction = async (raw_direction: any) =>{
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

    edit_order = async (order: number) => {
        this.order = order;
        return this.push_edit();
    }

    edit_n_registers = async (value: string) => {
        this.n_registers = [value];
        return this.push_edit();
    }

    edit_id = async (id: string) =>{
        let old_id = this.ID;
        this.ID = id;
        let remove_edit = {peripheral:this.parent_periph, field:"register", action:"remove", value:old_id};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_periph, remove_edit)
        let add_edit = {peripheral:this.parent_periph, field:"register", action:"add", value:this._get_register()};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_periph, add_edit)
        return store.dispatch(upsertRegister({id:old_id, obj:this}));
    }

    push_edit = async () =>{
        let edit = {peripheral:this.parent_periph, field:"register", action:"edit", value:this._get_register()};
        await backend_patch(api_dictionary.peripherals.edit+ '/' + this.parent_periph, edit)
        return store.dispatch(upsertRegister({id:this.ID, obj:this}));
    }

    set_fields = (fields: up_field[]) => {
        this.fields = fields;
    }

    add_field = (field: up_field) => {
        this.fields.push(field);
    }

    static async remove_register(periph:number, reg: string){
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
        let ret_obj: register ={
            ID: this.ID,
            register_name: this.register_name,
            description: this.description,
            fields: converted_fields,
            direction: this.direction,
            value: this.value,
            order: this.order,
            n_registers: this.n_registers
        }

        return ret_obj;
    }
}
