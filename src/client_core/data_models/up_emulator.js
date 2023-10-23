// Copyright 2023 Filippo Savi
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
import {AddEmulator, removeEmulator} from "../../redux/Actions/EmulatorActions";

export class up_emulator {
    constructor(emulator_obj) {
        if(!emulator_obj)
            return;
        this.id = emulator_obj.id;
        this.name = emulator_obj.name;
        this.cores = emulator_obj.cores;
        if(!emulator_obj.connections){
            this.connections = [];
        } else {
            this.connections = emulator_obj.connections;
        }
    }

    static construct_empty(emulator_id){
        let emulator_obj = {
            id:emulator_id,
            name:'new_emulator_'+ emulator_id,
            cores:{},
            connections:[]
        };
        return new up_emulator(emulator_obj);
    }

    add_remote = () => {
        store.dispatch(AddEmulator(this));
        return backend_post(api_dictionary.emulators.add+'/'+this.id, this._get_emulator());
    }

    add_core = (id) => {
        let c = {
            name: "new_core_" + id,
            id: id,
            order:id,
            program:{
                filename:"",
                type:""
            },
            channels:1,
            inputs:{},
            input_file:"",
            outputs:{},
            memory_init:{},
            options:{
                comparators:"reducing",
                efi:"none"
            }
        };
        this.cores[id] = c;
        let edit = {emulator:this.id, core:c, action:"add_core"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit).then((resp)=>{
            return new Promise((resolve)=>{
                resolve(c);
            })
        });
    }

    add_output = (core_id, progressive) => {
        let output = {
            reg_n: 0,
            type: "float",
            name: "new_output_" + progressive
        }
        this.cores[core_id].outputs.push(output);
        let edit = {emulator:this.id, core:core_id.toString(), output:output, action:"add_output"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    add_input = (core_id, progressive) => {
        let input = {
            reg_n: 0,
            type: "float",
            channel:0,
            name: "new_input_" + progressive
        }
        this.cores[core_id].inputs.push(input);
        let edit = {emulator:this.id, core:core_id.toString(), input:input, action:"add_input"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    add_memory = (core_id, progressive) =>{
        let mem = {
            reg_n: 0,
            type: "f",
            value:0,
            name: "new_memory_" + progressive
        }
        this.cores[core_id].memory_init.push(mem);
        let edit = {emulator:this.id, core:core_id.toString(), memory:mem, action:"add_memory"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }


    remove_output = (core_id, obj_name) => {
        this.cores[core_id].outputs = this.cores[core_id].outputs.filter((item)=>{
            return item.name !== obj_name;
        })
        let edit = {emulator:this.id, core:core_id.toString(), name:obj_name, action:"remove_output"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    remove_input = (core_id, obj_name) => {
        this.cores[core_id].inputs = this.cores[core_id].inputs.filter((item)=>{
            return item.name !== obj_name;
        })
        let edit = {emulator:this.id, core:core_id.toString(), name:obj_name, action:"remove_input"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    remove_memory = (core_id, obj_name) =>{
        this.cores[core_id].memory_init = this.cores[core_id].memory_init.filter((item)=>{
            return item.name !== obj_name;
        })
        let edit = {emulator:this.id, core:core_id.toString(), name:obj_name, action:"remove_memory"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    add_dma_connection = (source_id, target_id) =>{
        let c = {
            source:source_id,
            target:target_id,
            channels:[]
        }
        this.connections.push(c);
        let edit = {emulator:this.id, connection:c, action:"add_connection"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit).then((resp)=>{
            return new Promise((resolve)=>{
                resolve(c);
            })
        });
    }

    add_dma_channel = (source, target, progressive) =>{
        let c = {
            name:"new_dma_channel_" + progressive,
            source:{
                channel:0,
                register:0
            },
            target: {
                channel:0,
                register: 0
            }
        }
        let dma_obj = this.connections.filter((item)=>{
            return item.source === source && item.target === target;
        })[0];
        dma_obj.channels.push(c);
        let edit = {emulator:this.id, source:source, target:target, channel:c, action:"add_dma_channel"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    remove_dma_channel = (source, target, obj_name) =>{
        let dma_obj = this.connections.filter((item)=>{
            return item.source === source && item.target === target;
        })[0];
        dma_obj.channels = dma_obj.channels.filter((item)=>{
            return item.name !== obj_name;
        })
        let edit = {emulator:this.id, source:source, target:target, name:obj_name, action:"remove_dma_channel"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }


    static delete(emulator){
        return backend_delete(api_dictionary.emulators.delete+'/'+emulator.id, emulator).then(()=>{
            store.dispatch(removeEmulator(emulator));
        })
    }

    _get_emulator = () =>{
        return {
            id: this.id,
            name: this.name,
            cores: this.cores,
            connections: this.connections,
        };
    }


}
