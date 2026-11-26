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
import {backend_delete, backend_get, backend_patch, backend_post} from "../proxy/backend.js";
import {api_dictionary} from "../proxy/api_dictionary.js";
import {AddRpuProgram, removeRpuProgram} from "#redux/index.js";
import type {rpu_program_model} from "#interfaces/index.ts";

export class up_rpu_program {
    public id: number;
    public name: string;
    public data: string;
    public hash: string | undefined;
    public core: number;
    constructor(prog_obj: rpu_program_model) {
        this.id = prog_obj.id;
        this.name = prog_obj.name;
        this.data = prog_obj.data;
        this.hash = prog_obj.hash;
        this.core = prog_obj.core;

    }

    static construct_empty(prog_id: number){
        let obj:rpu_program_model = {id:prog_id, name:'new_rpu_program_'+prog_id, data:"", core: 0};
        return new up_rpu_program(obj);
    }

    add_remote = async () => {
        await backend_post(api_dictionary.rpu.add+'/'+this.id, this._get_rpu_obj());
        store.dispatch(AddRpuProgram(this));
        await this.refresh_hash();
    }

    /// Reads the hash of the file from the server, that computes it when it gets the file
    refresh_hash = async () =>{
        const stored: rpu_program_model = await backend_get(api_dictionary.rpu.get + '/' + this.id);
        this.hash = stored.hash;
        store.dispatch(AddRpuProgram(this));
    }

    update_file = async (prog: {name:string, content:string}) =>{
        this.name = prog.name;
        this.data = prog.content;
        let data_edit = {id:this.id , field:{name:"data", value:prog.content}};
        await backend_patch(api_dictionary.rpu.edit+'/'+this.id,data_edit);
        let name_edit = {id:this.id , field:{name: "name", value: prog.name}};
        await backend_patch(api_dictionary.rpu.edit+'/'+this.id,name_edit);
        store.dispatch(AddRpuProgram(this));
        await this.refresh_hash();
    }

    edit_field =<K extends keyof this>(field: K, value: this[K]) => {
        if(field !== "content")
            this[field] = value;
        store.dispatch(AddRpuProgram(this));
        let edit = {id:this.id , field:{name:field, value:value}};
        return backend_patch(api_dictionary.rpu.edit+'/'+this.id,edit)
    }

    /// Loads the program on the RPU core it is stored for and starts it. A core that is not offline is stopped
    /// and reloaded: there is no plain start, loading the program again is how a stopped core is restarted
    load = async () => {
        await backend_post(api_dictionary.operations.rpu_load + '/' + this.id, {});
    }

    static stop_core = async (core: number) => {
        await backend_post(api_dictionary.operations.rpu_stop + '/' + core, {});
    }

    /// The remoteproc state of the core: offline, running, crashed, ...
    static get_core_status = async (core: number): Promise<string> => {
        return backend_get<string>(api_dictionary.operations.rpu_status + '/' + core);
    }

    export_program = async () => {
        return backend_get(api_dictionary.rpu.get + '/'+this.id + "?export-program=true");
    }
    static async delete_program(program:up_rpu_program){
        await backend_delete(api_dictionary.rpu.delete+'/'+program.id, program);
        store.dispatch(removeRpuProgram(program));
    }

    static get_file_content(input_file: any): Promise<{content: string, name: string}>{
        return new Promise((resolve, reject) => {
            let file = input_file.target.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = function (evt) {
                    let result = {content:reader.result as string, name:file.name}
                    resolve(result)
                }
                reader.readAsDataURL(file);
            }
        })
    }



    get_raw_obj = () => {
        return this._get_rpu_obj();
    }

    _get_rpu_obj = () =>{
        return {
            id: this.id,
            name: this.name,
            data: this.data,
            core: this.core
        };
    }


}
