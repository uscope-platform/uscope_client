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
        this.n_cycles = emulator_obj.n_cycles;
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
            connections:[],
            n_cycles:1
        };
        return new up_emulator(emulator_obj);
    }

    add_remote = () => {
        return new Promise((resolve, reject) =>{
            backend_post(api_dictionary.emulators.add+'/'+this.id, this._get_emulator()).then((resp)=>{
                store.dispatch(AddEmulator(this))
                resolve();
            }).catch((error)=>{
                alert(error.response.data.message)
            })
        });
    }

    add_core = (id) => {
        let c = {
            name: "new_core_" + id,
            id: id,
            order:id,
            program:"",
            channels:1,
            inputs:[],
            input_data:[],
            outputs:[],
            memory_init:[],
            options:{
                comparators:"reducing",
                efi_implementation:"none"
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

    edit_name = (new_name) =>{
        let edit = {emulator:this.id, value:new_name, action:"edit_name"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit).then(()=>{
            this.name = new_name;
        });
    };
    edit_cycles = (n_cycles) =>{
        let edit = {emulator:this.id, value:n_cycles, action:"edit_cycles"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit).then(()=>{
            this.n_cycles = n_cycles;
        });
    };
    edit_core_props = (core_id, field, value) =>{
        let edit = {emulator:this.id, core:core_id.toString(), field_name:field, value:value, action:"edit_core_props"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit).then(()=>{
            this.cores[core_id][field] = value;
        });
    }

    remove_core = (core_id) =>{
        delete this.cores[core_id];
        let edit = {emulator:this.id, core:core_id.toString(), action:"remove_core"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    add_output = (core_id, progressive) => {
        let output = {
            reg_n: 0,
            type: "float",
            name: "new_output_" + progressive,
            register_type:"scalar"
        }
        this.cores[core_id].outputs.push(output);
        let edit = {emulator:this.id, core:core_id.toString(), output:output, action:"add_output"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    edit_output = (core_id, field, value, output_name) =>{
        let edit = {emulator:this.id, core:core_id.toString(), field_name:field, value:value, output:output_name, action:"edit_output"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit).then(()=>{
            this.cores[core_id].outputs = this.cores[core_id].outputs.map((item)=>{
                if(item.name === output_name){
                    return  {...item, ...{[field]:value}};
                } else {
                    return item;
                }
            });
        });
    }

    add_input_file = (core_id, input_name,  data) =>{
        let i_d = {
            name:input_name,
            data:data
        }
        this.cores[core_id].input_data.push(i_d);
        let edit = {emulator:this.id, core:core_id.toString(), input_data:i_d, action:"add_input_data"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    remove_input_file = (core_id, obj_name) => {
        this.cores[core_id].input_data = this.cores[core_id].input_data.filter((item)=>{
            return item.name !== obj_name;
        })
        let edit = {emulator:this.id, core:core_id.toString(), name:obj_name, action:"remove_input_data"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    add_input = (core_id, progressive) => {
        let input = {
            reg_n: 0,
            type: "float",
            source:{
                type:"constant",
                value:""
            },
            channel:0,
            name: "new_input_" + progressive,
            register_type:"scalar",
            labels:""
        }
        this.cores[core_id].inputs.push(input);
        let edit = {emulator:this.id, core:core_id.toString(), input:input, action:"add_input"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    edit_input = (core_id, field, value, input_name) =>{
        let edit = {emulator:this.id, core:core_id.toString(), field_name:field, value:value, input:input_name, action:"edit_input"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit).then(()=>{
            this.cores[core_id].inputs = this.cores[core_id].inputs.map((item)=>{
                if(item.name === input_name){
                    return  {...item, ...{[field]:value}};
                } else {
                    return item;
                }
            });
        });
    }

    add_memory = (core_id, progressive) =>{
        let mem = {
            reg_n: 0,
            type: "float",
            value:0,
            name: "new_memory_" + progressive,
            register_type:"scalar",
            vector_size:0,
            is_output:false
        }
        this.cores[core_id].memory_init.push(mem);
        let edit = {emulator:this.id, core:core_id.toString(), memory:mem, action:"add_memory"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    edit_memory = (core_id, field, value, memory_name) =>{
        let edit = {emulator:this.id, core:core_id.toString(), field_name:field, value:value, memory:memory_name, action:"edit_memory"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit).then(()=>{
            this.cores[core_id].memory_init = this.cores[core_id].memory_init.map((item)=>{
                if(item.name === memory_name){
                    return  {...item, ...{[field]:value}};
                } else {
                    return item;
                }
            });
        });
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

    remove_dma_connection = (source_id, target_id) =>{
        this.connections = this.connections.filter((item)=>{
            return item.source !== source_id && item.target !== target_id;
        });
        let edit = {emulator:this.id, source:source_id, target:target_id, action:"remove_connection"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    remove_node_connections = (node_id) =>{
        this.connections = this.connections.filter((item)=>{
            return item.source !== node_id && item.target !== node_id;
        });
        let edit = {emulator:this.id, node:node_id, action:"remove_node_connections"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
    }

    add_dma_channel = (source, target, progressive) =>{
        let c = {
            name:"new_dma_channel_" + progressive,
            type:"scalar_transfer",
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


    edit_dma_channel = (source, target,field, value, channel_name) =>{
        let edit = {emulator:this.id, source:source, target:target, field_name:field, value:value, channel:channel_name, action:"edit_dma_channel"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit).then(()=>{
            let dma_obj = this.connections.filter((item)=>{
                return item.source === source && item.target === target;
            })[0];
            dma_obj.channels = dma_obj.channels.map((item)=>{
                if(item.name === channel_name){
                    return  {...item, ...{[field]:value}};
                } else {
                    return item;
                }
            })
        });
    }


    remove_dma_channel = (source, target, obj_name) =>{
        let edit = {emulator:this.id, source:source, target:target, name:obj_name, action:"remove_dma_channel"};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit).then(()=>{
            this.connections = this.connections.map((item)=>{
                if(item.source === source && item.target === target){
                   let ret = item;
                    ret.channels = ret.channels.filter((item)=>{
                        return item.name !== obj_name;
                    })
                    return ret;
                } else {
                    return item;
                }
            });
            return new Promise((resolve)=>{
                resolve();
            })
        });
    }


    static delete(emulator){
        return backend_delete(api_dictionary.emulators.delete+'/'+emulator.id, emulator).then(()=>{
            store.dispatch(removeEmulator(emulator));
        })
    }

    build = () =>{
        return {
            cores: Object.values(this.cores).map((item) => {
                let merged_data = {};
                if (item.input_data.length !== 0) {

                    item.input_data.map((d) => {
                        merged_data = {...merged_data.data, ...d.data};
                    })
                }
                return ({
                    id: item.name,
                    order: item.order,
                    input_data: merged_data,
                    inputs: item.inputs.map((in_obj) => {
                        return {
                            name: in_obj.name,
                            type: in_obj.type,
                            source:in_obj.source,
                            reg_n: parseInt(in_obj.reg_n),
                            channel: in_obj.channel,
                            register_type: in_obj.register_type,
                            vector_labels: in_obj.labels.split(",").map(item => item.trim())
                        };
                    }),
                    outputs: item.outputs.map((out) => {

                        return {
                            name: out.name,
                            type: out.type,
                            reg_n: out.reg_n,
                            register_type: out.register_type
                        };
                    }),
                    memory_init: item.memory_init.map((mem) => {
                        let init_val = [];
                        let init_add = [];
                        if (mem.register_type === "vector") {
                            for (let i = 0; i < mem.vector_size; i++) {
                                init_val.push(parseInt(mem.value));
                                init_add.push(parseInt(mem.reg_n) + i);
                            }
                        } else {
                            init_val = parseInt(mem.value);
                            init_add = parseInt(mem.reg_n);
                        }

                        return {
                            name: mem.name,
                            type: mem.type,
                            is_output: mem.is_output,
                            reg_n: init_add,
                            value: init_val
                        };
                    }),
                    channels: item.channels,
                    program: (() => {
                        let prog = Object.values(store.getState().programs).filter((p) => {
                            return p.name === item.program;
                        })[0]
                        return {content: prog.program_content, build_settings: prog.build_settings};
                    })(),
                    options: item.options
                })
            }),
            interconnect: this.connections.map((item) => {
                return {
                    source: this.cores[item.source].name,
                    destination: this.cores[item.target].name,
                    channels: item.channels.map((item) => {
                        let ret = {
                            name: item.name,
                            type: item.type,
                            source: item.source,
                            source_output: item.source_output,
                            destination: item.target,
                            destination_input: item.target_input
                        };
                        if (item.length) ret.length = item.length;
                        if (item.stride) ret.stride = item.stride;
                        return ret;
                    })
                };
            }),
            n_cycles:this.n_cycles
        };
    }

    run = () =>{
        let specs = this.build();
        return backend_post(api_dictionary.emulators.run, specs).then((res)=>{
           return res;
        });
    };

    deploy = () =>{
        let specs = this.build();
        return backend_post(api_dictionary.hil.deploy, specs).then((res)=>{
            return res;
        })
    }

    get_raw_obj = () => {
        return this._get_emulator();
    }

    get_outputs= () =>{
        let target_outputs = {};
        Object.values(this.connections).map((dma)=>{
            dma.channels.map((ch)=>{
                switch (ch.type){
                    case "2d_vector_transfer":
                        for(let i = 0; i<ch.stride; i++){
                            target_outputs[ch.target.register + i] = ch.name + "[" + i + "]";
                        }
                        break;
                    case "scalar_transfer":
                        target_outputs[ch.target.register] = ch.name;
                        break;
                }
            })
        })
        Object.values(this.cores).map((core)=>{
            core.outputs.map((out)=>{
                if(out.register_type ==="scalar"){
                    target_outputs[out.reg_n] = out.name;
                } else {
                }
            })
        })
        return target_outputs;
    }

    get_inputs =() =>{
        let target_inputs = [];

        Object.values(this.cores).map((core)=>{
            core.inputs.map((i)=>{
                if(i.source.type === "constant"){
                    target_inputs.push({name:i.name, address:i.reg_n, value:i.source.value});
                }
            })
        })
        return target_inputs;
    }

    _get_emulator = () =>{
        return {
            id: this.id,
            name: this.name,
            cores: this.cores,
            n_cycles: this.n_cycles,
            connections: this.connections,
        };
    }


}
