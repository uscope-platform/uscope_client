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
import {backend_delete, backend_patch, backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {AddProgram, removeProgram} from "@redux";
import objectHash from "object-hash";

export class up_program {
    constructor(program_obj) {
        if(program_obj===undefined)
            return;
        this.id = program_obj.id;
        this.name = program_obj.name;
        this.content = program_obj.content;
        this.type = program_obj.type;
        if(!program_obj.headers){
            this.headers = [];
        } else{
            this.headers = program_obj.headers;
        }
    }

    static construct_empty(program_id){
        let program_obj = {
            id:program_id,
            name:'new program_'+program_id,
            content:'',
            type:''
        };
        return new up_program(program_obj);
    }

    deep_copy = () =>{
        let ret = {};
        ret.id = this.id;
        ret.name = this.name;
        ret.content =this.content;
        ret.type =this.type;
        ret.headers = JSON.parse(JSON.stringify(this.headers));
        return ret;
    }

    add_remote = () => {
        store.dispatch(AddProgram(this));
        return backend_post(api_dictionary.programs.add+'/'+this.id, this._get_program());
    }

    set_content = (content) => {
        return this.edit_field('content', content);
    }

    edit_field = async (field, value) => {
        this[field] = value;
        let edit = {program:this.id, field:field, value:value};
        await backend_patch(api_dictionary.programs.edit+'/'+this.id,edit)
        store.dispatch(AddProgram(this.deep_copy()));
    }

    add_header = (id) =>{
        let selected_headers = [...this.headers, id];
        return this.edit_field("headers", selected_headers);
    };

    remove_header = (id) =>{
        let selected_headers = this.headers.filter(h=>{
            return h !== id;
        });
        return this.edit_field("headers", selected_headers);
    };

     compile = async () =>{
         let headers = this.headers.map((h)=>{
             let header = store.getState().programs[h];
             return {name: header.name, content: header.content};
         })

         let data_package = {
             content:this.content,
             headers:headers,
             io:[],
             type:this.type
         }
        return backend_post(api_dictionary.operations.compile_program, data_package)
    };

    load = (core) => {

        let headers = this.headers.map((h)=>{
            let header = store.getState().programs[h];
            return {name: header.name, content: header.content};
        })

        let data_package = {
            id:this.id,
            name:this.name,
            content:this.content,
            headers:headers,
            io:core.io,
            type:this.type,
            core_address:core.address
        }
        let h = objectHash(data_package)
        return backend_post(api_dictionary.operations.apply_program+'/' + this.id, {...data_package, hash:h}).then((res)=>{
            return res;
        })
    }

    static delete(program){
        return backend_delete(api_dictionary.programs.delete+'/'+program.id, program).then(()=>{
            store.dispatch(removeProgram(program));
        })
    }

    get_raw_obj = () => {
        return this._get_program();
    }

    _get_program = () =>{
        return {
            id: this.id,
            name: this.name,
            content: this.content,
            type: this.type,
            headers: this.headers
        };
    }


}
