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
import {backend_delete, backend_get, backend_patch, backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {addEmulator, removeEmulator, update_emulator} from "../../redux/Actions/EmulatorActions";

export class up_emulator {
    constructor(emulator_obj) {
        if(!emulator_obj)
            return;
        this.id = emulator_obj.id;
        this.name = emulator_obj.name;
        this.cores = emulator_obj.cores;
        this.emulation_time = emulator_obj.emulation_time;
        this.deployment_mode = emulator_obj.deployment_mode;
        if(!emulator_obj.connections){
            this.connections = [];
        } else {
            this.connections = emulator_obj.connections;
        }
    }

    deep_copy = ()=>{
        let ret = {};
        ret.deployment_mode = this.deployment_mode;
        ret.id = this.id;
        ret.name = this.name;
        ret.cores = JSON.parse(JSON.stringify(this.cores));
        ret.connections = JSON.parse(JSON.stringify(this.connections));
        ret.emulation_time = this.emulation_time;
        return ret;
    }

    static construct_empty(emulator_id){
        let emulator_obj = {
            id:emulator_id,
            name:'new_emulator_'+ emulator_id,
            cores:{},
            connections:[],
            emulation_time:0.001,
            deployment_mode:false
        };
        return new up_emulator(emulator_obj);
    }

    add_remote = async () => {
        try{
            let ret = await backend_post(api_dictionary.emulators.add + '/' + this.id, this._get_emulator());
            store.dispatch(addEmulator(this));
            return ret;
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    add_core = async (id) => {
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
            },
            sampling_frequency:0,
            deployment:{
                rom_address:0,
                control_address:0,
                has_reciprocal:false
            }
        };
        this.cores[id] = c;
        let edit = {emulator:this.id, core:c, action:"add_core"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
        return c;
    }

    edit_name = async (new_name) =>{
        let edit = {emulator:this.id, value:new_name, action:"edit_name"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.name = new_name;
        store.dispatch(update_emulator(this.deep_copy()));
    };

    edit_emulation_time =async (emu_time) =>{
        let edit = {emulator:this.id, value:emu_time, action:"edit_emu_time"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.emulation_time = emu_time;
        store.dispatch(update_emulator(this.deep_copy()));
    };

    edit_deployment_mode =async (mode) =>{
        let edit = {emulator:this.id, value:mode, action:"edit_deployment_mode"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.deployment_mode = mode;
        store.dispatch(update_emulator(this.deep_copy()));
    };


    edit_core_props = async (core_id, field, value) =>{
        let edit = {emulator:this.id, core:core_id.toString(), field_name:field, value:value, action:"edit_core_props"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit)
        this.cores[core_id][field] = value;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    remove_core = async (core_id) =>{
        delete this.cores[core_id];
        let edit = {emulator:this.id, core:core_id.toString(), action:"remove_core"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_output = async (core_id, progressive) => {
        let output = {
            reg_n: 0,
            width: 32,
            signed: true,
            type: "float",
            name: "new_output_" + progressive
        }
        this.cores[core_id].outputs.push(output);
        let edit = {emulator:this.id, core:core_id.toString(), output:output, action:"add_output"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }

    edit_output = async (core_id, field, value, output_name) =>{
        let edit = {emulator:this.id, core:core_id.toString(), field_name:field, value:value, output:output_name, action:"edit_output"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id].outputs = this.cores[core_id].outputs.map((item)=>{
            if(item.name === output_name){
                return  {...item, ...{[field]:value}};
            } else {
                return item;
            }
        });
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_input_file = async (core_id, input_name,  data) =>{
        let i_d = {
            name:input_name,
            data:data
        }
        this.cores[core_id].input_data.push(i_d);
        let edit = {emulator:this.id, core:core_id.toString(), input_data:i_d, action:"add_input_data"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }

    remove_input_file = async (core_id, obj_name) => {
        this.cores[core_id].input_data = this.cores[core_id].input_data.filter((item)=>{
            return item.name !== obj_name;
        })
        let edit = {emulator:this.id, core:core_id.toString(), name:obj_name, action:"remove_input_data"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_input =async (core_id, progressive) => {
        let input = {
            reg_n: 0,
            type: "float",
            width: 32,
            signed: true,
            common_io: false,
            source:{
                type:"constant",
                value:""
            },
            channel:0,
            name: "new_input_" + progressive,
            labels:""
        }
        this.cores[core_id].inputs.push(input);
        let edit = {emulator:this.id, core:core_id.toString(), input:input, action:"add_input"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }

    edit_input =async (core_id, field, value, input_name) =>{
        let edit = {emulator:this.id, core:core_id.toString(), field_name:field, value:value, input:input_name, action:"edit_input"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id].inputs = this.cores[core_id].inputs.map((item)=>{
            if(item.name === input_name){
                return  {...item, ...{[field]:value}};
            } else {
                return item;
            }
        });
        store.dispatch(update_emulator(this.deep_copy()));
    }

    edit_deployment_options = async (core_id, options_obj) =>{
        let edit = {emulator:this.id, core:core_id.toString(),  value:options_obj, action:"edit_deployment_options"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id].deployment = options_obj;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_memory = async (core_id, progressive) =>{
        let mem = {
            reg_n: 0,
            type: "float",
            width: 32,
            signed: true,
            value:0,
            name: "new_memory_" + progressive,
            is_output:false
        }
        this.cores[core_id].memory_init.push(mem);
        let edit = {emulator:this.id, core:core_id.toString(), memory:mem, action:"add_memory"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }

    edit_memory = async (core_id, field, value, memory_name) =>{
        let edit = {emulator:this.id, core:core_id.toString(), field_name:field, value:value, memory:memory_name, action:"edit_memory"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id].memory_init = this.cores[core_id].memory_init.map((item)=>{
            if(item.name === memory_name){
                return  {...item, ...{[field]:value}};
            } else {
                return item;
            }
        });
        store.dispatch(update_emulator(this.deep_copy()));
    }

    remove_output =async (core_id, obj_name) => {
        this.cores[core_id].outputs = this.cores[core_id].outputs.filter((item)=>{
            return item.name !== obj_name;
        })
        let edit = {emulator:this.id, core:core_id.toString(), name:obj_name, action:"remove_output"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }

    remove_input = async (core_id, obj_name) => {
        this.cores[core_id].inputs = this.cores[core_id].inputs.filter((item)=>{
            return item.name !== obj_name;
        })
        let edit = {emulator:this.id, core:core_id.toString(), name:obj_name, action:"remove_input"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }

    remove_memory =async (core_id, obj_name) =>{
        this.cores[core_id].memory_init = this.cores[core_id].memory_init.filter((item)=>{
            return item.name !== obj_name;
        })
        let edit = {emulator:this.id, core:core_id.toString(), name:obj_name, action:"remove_memory"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_dma_connection = async (source_id, target_id) =>{
        let c = {
            source:source_id,
            target:target_id,
            channels:[]
        }
        this.connections.push(c);
        let edit = {emulator:this.id, connection:c, action:"add_connection"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
        return c;
    }

    remove_dma_connection = async (source_id, target_id) =>{
        this.connections = this.connections.filter((item)=>{
            return item.source !== source_id && item.target !== target_id;
        });
        let edit = {emulator:this.id, source:source_id, target:target_id, action:"remove_connection"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }

    remove_node_connections =async (node_id) =>{
        this.connections = this.connections.filter((item)=>{
            return item.source !== node_id && item.target !== node_id;
        });
        let edit = {emulator:this.id, node:node_id, action:"remove_node_connections"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_dma_channel = async (source, target, progressive) =>{
        let c = {
            name:"new_dma_channel_" + progressive,
            type:"scalar_transfer",
            source:{
                channel:[0],
                register:[0]
            },
            target: {
                channel:[0],
                register: [0]
            },
            length:1
        }
        let dma_obj = this.connections.filter((item)=>{
            return item.source === source && item.target === target;
        })[0];
        dma_obj.channels.push(c);
        let edit = {emulator:this.id, source:source, target:target, channel:c, action:"add_dma_channel"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        store.dispatch(update_emulator(this.deep_copy()));
    }


    edit_dma_channel = async (source, target,field, value, channel_name) =>{
        let edit = {emulator:this.id, source:source, target:target, field_name:field, value:value, channel:channel_name, action:"edit_dma_channel"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
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
        store.dispatch(update_emulator(this.deep_copy()));
    }


    remove_dma_channel =  async (source, target, obj_name) =>{
        let edit = {emulator:this.id, source:source, target:target, name:obj_name, action:"remove_dma_channel"};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
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
        store.dispatch(update_emulator(this.deep_copy()));
    }


    static async delete(emulator) {
        await backend_delete(api_dictionary.emulators.delete+'/'+emulator.id, emulator);
        store.dispatch(removeEmulator(emulator.id));
    }

    get_output_names = (core_id) =>{
        return this.cores[core_id].outputs.map((item)=>{
            return item.name;
        })
    }

    get_memory_names = (core_id) =>{
        return this.cores[core_id].memory_init.map((item)=>{
            return item.name;
        })
    }

    get_input_names = (core_id) =>{
        return this.cores[core_id].inputs.map((item)=>{
            return item.name;
        })
    }

    build = () =>{
        return {
            cores: Object.values(this.cores).map((item) => {
                return ({
                    id: item.name,
                    order: item.order,
                    input_data: item.input_data,
                    inputs: item.inputs.map((in_obj) => {
                        let source = in_obj.source;
                        if(in_obj.source.type === "file"){
                            let tok = in_obj.source.value.split(".");
                            source = {
                                type: in_obj.source.type,
                                file: tok[0],
                                series: tok[1]
                            };
                        }
                        return {
                            name: in_obj.name,
                            metadata:{
                                type: in_obj.type,
                                width: in_obj.width,
                                signed: in_obj.signed,
                                common_io:in_obj.common_io
                            },
                            source:source,
                            reg_n: in_obj.reg_n,
                            channel: in_obj.channel
                        };
                    }),
                    outputs: item.outputs.map((out) => {

                        return {
                            name: out.name,
                            reg_n: out.reg_n,
                            metadata:{
                                type: out.type,
                                width: out.width,
                                signed: out.signed
                            }
                        };
                    }),
                    memory_init: item.memory_init.map((mem) => {
                        let init_val = [];
                        let init_add = [];
                        let vect_size = mem.reg_n.length;
                        if(vect_size === 0) vect_size++;
                        for (let i = 0; i < vect_size; i++) {
                            init_val.push(parseInt(mem.value));
                            init_add.push(parseInt(mem.reg_n) + i);
                        }

                        return {
                            name: mem.name,
                            metadata:{
                                type: mem.type,
                                width: mem.width,
                                signed: mem.signed,
                            },
                            is_output: mem.is_output,
                            reg_n: init_add,
                            value: init_val
                        };
                    }),
                    deployment:item.deployment,
                    channels: item.channels,
                    program: (() => {
                        let prog = Object.values(store.getState().programs).filter((p) => {
                            return p.name === item.program;
                        })[0]
                        let headers = prog.headers.map((h)=>{
                            return store.getState().programs[h].program_content;
                        })
                        return {content: prog.program_content, build_settings: prog.build_settings, headers:headers};
                    })(),
                    options: item.options,
                    sampling_frequency: item.sampling_frequency
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
                        else ret.length = 1;
                        if (item.stride) ret.stride = item.stride;
                        return ret;
                    })
                };
            }),
            emulation_time:this.emulation_time,
            deployment_mode:this.deployment_mode
        };
    }

    run = async () =>{
        let specs = this.build();
        return await backend_post(api_dictionary.emulators.run, specs);
    };

    deploy = async () =>{
        let specs = this.build();
        return await backend_post(api_dictionary.hil.deploy, specs);
    }

    get_raw_obj = () => {
        return this._get_emulator();
    }

    get_hil_data_points = () =>{
        let dp = [];
        let processed_iom = []
        Object.values(this.connections).map((dma)=>{
            let source_core = this.cores[dma.source].name;
            dma.channels.map((ch)=>{
                switch (ch.type) {
                    case "scalar_transfer":
                        processed_iom.push([dma.source, ch.source_output, 0, 0])
                        dp.push({
                            name: source_core + "." + ch.source_output,
                            source:source_core,
                            output:ch.source_output,
                            address: ch.source.register[0],
                            channel:ch.source.channel[0]
                        })
                        break;
                    case "scatter_transfer":
                        for(let i = 0; i<ch.length; i++){
                            processed_iom.push([dma.source, ch.source_output, i, 0])
                            dp.push({
                                name: source_core+ "." + ch.source_output + "(" + i + ",0)",
                                source:source_core,
                                output:ch.source_output,
                                address: ch.source.register[0] + i,
                                channel:ch.source.channel[0]
                            })
                        }
                        break;
                    case "gather_transfer":
                        for(let i = 0; i<ch.length; i++){
                            processed_iom.push([dma.source, ch.source_output, i, 0])
                            dp.push({
                                name: source_core + "." + ch.source_output + "(0," + i+ ")",
                                source:source_core,
                                output:ch.source_output,
                                address: ch.source.register[0],
                                channel:ch.source.channel[0] + i
                            })
                        }
                        break;
                    case "vector_transfer":
                        for(let i = 0; i<ch.length; i++){

                            processed_iom.push([dma.source, ch.source_output,i, i])
                            dp.push({
                                name: source_core + "." + ch.source_output + "("+ i+"," + i+ ")",
                                source:source_core,
                                output:ch.source_output,
                                address: ch.source.register[0],
                                channel:ch.source.channel[0] + i
                            })
                        }
                        break;
                    case "2d_vector_transfer":
                        for(let j = 0; j<ch.stride; j++) {
                            for (let i = 0; i < ch.length; i++) {
                                processed_iom.push([dma.source, ch.source_output, j , i])
                                dp.push({
                                    name: source_core + "." + ch.source_output + "(" +j + "," + i + ")",
                                    source: source_core,
                                    output:ch.source_output,
                                    address: ch.source.register[0] + j,
                                    channel: ch.source.channel[0] + i
                                })
                            }
                        }
                        break;
                }
            })
        });

        Object.values(this.cores).map((core)=>{
            core.outputs.map((out)=>{
                for(let i = 0; i<core.channels; i++){
                    for(let j = 0; j<out.reg_n.length; j++) {
                        if (!processed_iom.some(e =>  JSON.stringify(e) === JSON.stringify([core.id, out.name, j, i]))) {
                            dp.push({
                                name: core.name + "." + out.name + "(" +j + "," + i + ")",
                                source: core.name,
                                output:out.name,
                                address: out.reg_n[0] + j,
                                channel: i
                            })
                        }
                    }
                }
            })
        })
        return dp;
    }

    select_output = (channel, output) =>{
        return backend_post(api_dictionary.hil.select_output, {channel:channel, output:output});
    }

    get_inputs =() =>{
        let target_inputs = [];

        Object.values(this.cores).map((core)=>{
            core.inputs.map((i)=>{
                if(i.source.type === "constant"){
                    target_inputs.push({core: core.name, name:i.name, address:i.reg_n, value:i.source.value});
                }
            })
        })
        return target_inputs;
    }

    set_input = (core, address, value) =>{
        return backend_post(api_dictionary.hil.set_input, {"address":address, "value":value, "core": core});
    }

    start_hil = () =>{
        return backend_get(api_dictionary.hil.start);
    }
    stop_hil = () =>{
        return backend_get(api_dictionary.hil.stop);
    }


    _get_emulator = () =>{
        return {
            id: this.id,
            name: this.name,
            cores: this.cores,
            emulation_time:this.emulation_time,
            connections: this.connections,
            deployment_mode: this.deployment_mode
        };
    }

}
