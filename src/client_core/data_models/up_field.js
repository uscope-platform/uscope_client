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
import {backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";

export class up_field {
    constructor(field_obj, parent_r, parent_p) {
        this.name = field_obj.name;
        this.parent_register = parent_r;
        this.parent_peripheral = parent_p;
        this.description = field_obj.description;
        this.length = field_obj.length;
        this.offset = field_obj.offset;
    }

    static construct_empty(field_name, parent_r, parent_p){
        let field_obj = {name:field_name, description:"", length:1,  offset:0};
        return new up_field(field_obj, parent_r, parent_p);
    }

    edit_name = (name) =>{
        let edit = {peripheral:this.parent_peripheral, register:this.parent_register, field:"name",field_name:this.name, value:name, action:"edit_field"};
        let old_name = this.name;
        this.name = name;
        store.dispatch(upsertField(this, old_name, this.parent_register, this.parent_peripheral));
        return backend_post(api_dictionary.peripherals.edit, edit)
    }

    edit_description = (description) =>{
        let edit = {peripheral:this.parent_peripheral, register:this.parent_register, field:"description",field_name:this.name, value:description, action:"edit_field"};
        this.description = description;
        store.dispatch(upsertField(this, this.name, this.parent_register, this.parent_peripheral));
        return backend_post(api_dictionary.peripherals.edit, edit)
    };

    edit_length = (length) => {
        let edit = {peripheral:this.parent_peripheral, register:this.parent_register, field:"length",field_name:this.name, value:length, action:"edit_field"};
        this.length = length;
        store.dispatch(upsertField(this, this.name, this.parent_register, this.parent_peripheral));
        return backend_post(api_dictionary.peripherals.edit, edit)
    }

    edit_offset = (offset) => {
        let edit = {peripheral:this.parent_peripheral, register:this.parent_register, field:"offset",field_name:this.name, value:offset, action:"edit_field"};
        this.offset = offset;
        store.dispatch(upsertField(this, this.name, this.parent_register, this.parent_peripheral));
        return backend_post(api_dictionary.peripherals.edit, edit)
    }

    static remove_field(periph, reg, field){
        let edit = {peripheral:periph, register:reg,field_name:field, action:"remove_field"};
        return backend_post(api_dictionary.peripherals.edit, edit).then(()=>{
            store.dispatch(removeField(periph, reg, field));
        })
    }

    _get_field = () => {
        return{
            "name": this.name,
            "description": this.description,
            "length": this.length,
            "offset": this.offset
        }
    }
}