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
import {backend_delete, backend_get, backend_patch, backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {AddProgram, removeProgram} from "../../redux/Actions/ProgramsActions";
import objectHash from "object-hash";

export class up_program {
    constructor(program_obj) {
        if(program_obj===undefined)
            return;
        this.id = program_obj.id;
        this.name = program_obj.name;
        this.program_content = program_obj.program_content;
        this.program_type = program_obj.program_type;
        this.build_settings = program_obj.build_settings;
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
            program_content:'',
            program_type:'',
            build_settings:{
                io:{
                    inputs: [],
                    outputs: [],
                    memories: []
                }
            }
        };
        return new up_program(program_obj);
    }

    add_remote = () => {
        store.dispatch(AddProgram(this));
        return backend_post(api_dictionary.programs.add+'/'+this.id, this._get_program());
    }

    set_content = (content) => {
        return this.edit_field('program_content', content);
    }

    edit_field = (field, value) => {
        this[field] = value;
        store.dispatch(AddProgram(this));
        let edit = {program:this.id, field:field, value:value};
        return backend_patch(api_dictionary.programs.edit+'/'+this.id,edit)
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
             return {name: header.name, content: header.program_content};
         })

         let data_package = {
             content:this.program_content,
             headers:headers,
             io:[],
             type:this.program_type
         }
        return backend_post(api_dictionary.programs.compile+'/'+this.id, data_package)
    };

    load = (core) => {

        let headers = this.headers.map((h)=>{
            let header = store.getState().programs[h];
            return {name: header.name, content: header.program_content};
        })

        let data_package = {
            content:this.program_content,
            headers:headers,
            io:core.io,
            type:this.program_type,
            core_address:core.address
        }
        let h = objectHash(data_package)
        return backend_post(api_dictionary.programs.apply+'/' + this.id, {...data_package, hash:h}).then((res)=>{
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
            program_content: this.program_content,
            program_type: this.program_type,
            build_settings: this.build_settings,
            headers: this.headers
        };
    }


}
