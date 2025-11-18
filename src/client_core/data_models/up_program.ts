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
import {backend_delete, backend_patch, backend_post} from "../proxy/backend.js";
import {api_dictionary} from "../proxy/api_dictionary.js";
import {AddProgram, removeProgram} from "#redux/index.js";
import objectHash from "object-hash";

import type {program, soft_core} from '#interfaces/index.ts'


export class up_program {

    public id: number;
    public name: string;
    public content: string;
    public type : string;
    public headers:number[];

    constructor(program_obj: program) {
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

    static construct_empty(program_id: number): up_program{
        let program_obj: program = {
            id:program_id,
            name:'new program_'+program_id,
            content:'',
            type:'',
            headers:[]
        };
        return new up_program(program_obj);
    }

    deep_copy = (): up_program =>{
        return new up_program({
            id: this.id,
            name: this.name,
            content: this.content,
            type: this.type,
            headers:JSON.parse(JSON.stringify(this.headers))
        });
    }

    static deep_copy_s =  (old_program: program): program => {
        return {
            id: old_program.id,
            name: old_program.name,
            content: old_program.content,
            type: old_program.type,
            headers: JSON.parse(JSON.stringify(old_program.headers)),
        };
    }

    static duplicate = async (old_program: program, new_id: number): Promise<program> => {
        let new_program = up_program.deep_copy_s(old_program);
        new_program.id = new_id;
        new_program.name = old_program.name + "_copy_" + new_id;
        return new up_program(new_program);
    }

    static delete(p: up_program){
        return backend_delete(api_dictionary.programs.delete+'/'+p.id, p).then(()=>{
            store.dispatch(removeProgram(p));
        })
    }

    add_remote = () => {
        store.dispatch(AddProgram(this));
        return backend_post(api_dictionary.programs.add+'/'+this.id, this._get_program());
    }

    set_content = (content: string) => {
        return this.edit_field('content', content);
    }

    edit_field = async <K extends keyof up_program>(field: K, value: up_program[K]) => {
        (this as any)[field] = value;
        let edit = {program:this.id, field:field, value:value};
        await backend_patch(api_dictionary.programs.edit+'/'+this.id,edit)
        store.dispatch(AddProgram(this.deep_copy()));
    }

    add_header = (id: number) =>{
        let selected_headers = [...this.headers, id];
        return this.edit_field("headers", selected_headers);
    };

    remove_header = (id: number) =>{
        let selected_headers = this.headers.filter(h=>{
            return h !== id;
        });
        return this.edit_field("headers", selected_headers);
    };

     compile = async () =>{
         let headers = this.headers.map((h)=>{

             let header =  store.getState().programs[h];
             if(!header){
                 console.error("Header not found: ", h, "while loading program: ", this.id);
                 return;
             }
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

    load = (core: soft_core) => {

        let headers = this.headers.map((h)=>{
            let header =   store.getState().programs[h];
            if(!header){
                console.error("Header not found: ", h, "while loading program: ", this.id);
                return;
            }
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
