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


import {store} from "../../index";
import {backend_delete, backend_get, backend_patch, backend_post} from "../../proxy/backend";
import {api_dictionary} from "../../proxy/api_dictionary";
import {addEmulator, removeEmulator, update_emulator} from "@redux";

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

    static get_dummy(){
        let emulator_obj = {
            id:9999,
            name:"",
            cores:{},
            connections:[],
            emulation_time:0.001,
            deployment_mode:false
        };
        return new up_emulator(emulator_obj);
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

    static deep_copy_s(emulator_obj){
        let ret = {};
        ret.deployment_mode = emulator_obj.deployment_mode;
        ret.id = emulator_obj.id;
        ret.name = emulator_obj.name;
        ret.cores = JSON.parse(JSON.stringify(emulator_obj.cores));
        ret.connections = JSON.parse(JSON.stringify(emulator_obj.connections));
        ret.emulation_time = emulator_obj.emulation_time;
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

    static duplicate = async (old_emulator, new_id) => {
        let new_emulator = up_emulator.deep_copy_s(old_emulator);
        new_emulator.id = new_id;
        new_emulator.name = old_emulator.name + "_copy_" + new_id;
        return new up_emulator(new_emulator);
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

    add_core = async () => {
        let id = this.find_free_id();
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
        return this.send_core(c);
    }

    send_core = async (c) => {
        let edit = {id:this.id, field:"cores",  action:"add", value:c};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[c.id] = c;
        store.dispatch(update_emulator(this.deep_copy()));
        return c;
    }

    find_free_id = () => {
        let id = 1;
        while(this.cores[id] !== undefined){
            id++;
        }
        return id;
    }

    duplicate_core = async (core_id) => {
        let core = JSON.parse(JSON.stringify(this.cores[core_id]));
        let new_id = this.find_free_id();
        core.name = core.name + "_copy_" + new_id;
        core.id = new_id
        core.order = new_id+1;
        return this.send_core(core);
    }

    edit_name = async (new_name) =>{
        let edit = {id:this.id, field:"name",  action:"edit", value:new_name};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.name = new_name;
        store.dispatch(update_emulator(this.deep_copy()));
    };

    edit_emulation_time =async (emu_time) =>{
        let edit = {id:this.id, field:"emulation_time",  action:"edit", value:emu_time};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.emulation_time = emu_time;
        store.dispatch(update_emulator(this.deep_copy()));
    };

    edit_deployment_mode =async (mode) =>{
        let edit = {id:this.id, field:"deployment_mode",  action:"edit", value:mode};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.deployment_mode = mode;
        let copy_em = this.deep_copy();
        store.dispatch(update_emulator(copy_em));
    };


    edit_core_props = async (core_id, field, value) =>{
        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));
        if(field === "channels"){
            let new_inputs = JSON.parse(JSON.stringify(core.inputs));
            for(let i of new_inputs){
                if(i.source.type === "waveform"){
                    i.source = this.fix_waveform_parameters(i.source, value, core.channels);
                }
            }
            core.inputs = new_inputs;
        }
        core[field] = value;
        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    fix_waveform_parameters = (input, new_length, old_length) =>{
        let new_source = input;
        if(new_length > old_length){
            let fill_length = new_length - old_length;
            input.von =    [...input.von, ...Array(fill_length).fill(input.von[old_length-1])];
            input.voff =   [...input.voff, ...Array(fill_length).fill(input.voff[old_length-1])];
            input.tdelay = [...input.tdelay, ...Array(fill_length).fill(input.tdelay[old_length-1])];
            input.ton =    [...input.ton, ...Array(fill_length).fill(input.ton[old_length-1])];
            input.period = [...input.period, ...Array(fill_length).fill(input.period[old_length-1])];
            input.dc_offset = [...input.dc_offset, ...Array(fill_length).fill(input.dc_offset[old_length-1])];
            input.amplitude = [...input.amplitude, ...Array(fill_length).fill(input.amplitude[old_length-1])];
            input.frequency = [...input.frequency, ...Array(fill_length).fill(input.frequency[old_length-1])];
            input.phase = [...input.phase, ...Array(fill_length).fill(input.phase[old_length-1])];
            input.duty = [...input.duty, ...Array(fill_length).fill(input.duty[old_length-1])];
        }
        if(new_length < old_length){
            input.von = input.von.slice(0, new_length);
            input.voff = input.voff.slice(0, new_length);
            input.tdelay = input.tdelay.slice(0, new_length);
            input.ton = input.ton.slice(0, new_length);
            input.period = input.period.slice(0, new_length);
            input.dc_offset = input.dc_offset.slice(0, new_length);
            input.amplitude = input.amplitude.slice(0, new_length);
            input.frequency = input.frequency.slice(0, new_length);
            input.phase = input.phase.slice(0, new_length);
            input.duty = input.duty.slice(0, new_length);
        }
        return new_source;
    }
    remove_core = async (core_id) =>{
        let edit = {id:this.id, field:"cores",  action:"remove", value:core_id};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        delete this.cores[core_id];
        for(let i of this.connections){
            if(i.source_core === core_id || i.destination_core === core_id){
                await this.remove_dma_connection(i.source_core, i.destination_core);
            }
        }
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_output = async (core_id, progressive) => {
        let output = {
            width: 32,
            is_vector:false,
            vector_size: 1,
            signed: true,
            type: "float",
            name: "new_output_" + progressive
        }
        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));
        core.outputs.push(output);
        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    edit_output = async (core_id, field, value, output_name) =>{

        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));
        core.outputs = core.outputs.map((item)=>{
            if(item.name === output_name){
                return  {...item, ...{[field]:value}};
            } else {
                return item;
            }
        });
        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_input_file = async (core_id, input_name,  data) =>{
        let i_d = {
            name:input_name,
            data:data
        }

        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));
        core.input_data.push(i_d);

        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    remove_input_file = async (core_id, obj_name) => {

        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));
        core.input_data = core.input_data.filter((item)=>{
            return item.name !== obj_name;
        })

        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_input =async (core_id, progressive) => {
        let waveform_default = Array(this.cores[core_id].channels).fill(0);
        let input = {
            type: "float",
            width: 32,
            signed: true,
            common_io: false,
            is_vector:false,
            vector_size: 1,
            source:{
                type:"constant",
                value:"",
                shape:"square",
                von:waveform_default,
                voff:waveform_default,
                tdelay:waveform_default,
                ton:waveform_default,
                period:waveform_default,
                dc_offset:waveform_default,
                amplitude:waveform_default,
                frequency:waveform_default,
                phase:waveform_default,
                duty:waveform_default
            },
            name: "new_input_" + progressive,
            labels:""
        }

        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));
        core.inputs.push(input);

        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    edit_input =async (core_id, field, value, input_name) =>{

        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));
        core.inputs = core.inputs.map((item)=>{
            if(item.name === input_name){
                return  {...item, ...{[field]:value}};
            } else {
                return item;
            }
        });

        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    edit_deployment_options = async (core_id, options_obj) =>{

        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));
        core.deployment = options_obj;


        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_memory = async (core_id, progressive) =>{
        let mem = {
            type: "float",
            is_vector:false,
            vector_size: 1,
            width: 32,
            signed: true,
            value:0,
            name: "new_memory_" + progressive,
            is_output:false,
            is_input:false
        }

        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));
        core.memory_init.push(mem);

        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    edit_memory = async (core_id, field, value, memory_name) =>{

        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));
        core.memory_init = core.memory_init.map((item)=>{
            if(item.name === memory_name){
                return  {...item, ...{[field]:value}};
            } else {
                return item;
            }
        });

        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    remove_output =async (core_id, obj_name) => {

        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));

        core.outputs = core.outputs.filter((item)=>{
            return item.name !== obj_name;
        })

        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    remove_input = async (core_id, obj_name) => {

        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));

        core.inputs = core.inputs.filter((item)=>{
            return item.name !== obj_name;
        })

        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    remove_memory =async (core_id, obj_name) =>{

        let core  = JSON.parse(JSON.stringify(this.cores[core_id]));

        core.memory_init = core.memory_init.filter((item)=>{
            return item.name !== obj_name;
        })

        let edit = {id:this.id, field:"cores",  action:"edit", value:core};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.cores[core_id] = core;
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_dma_connection = async (source_id, destination_id) =>{
        let c = {
            source_core:source_id,
            destination_core:destination_id,
            ports:[]
        }
        let edit = {id:this.id, field:"connections",  action:"add", value:c};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.connections.push(c);
        store.dispatch(update_emulator(this.deep_copy()));
        return c;
    }

    remove_dma_connection = async (source_id, destination_id) =>{

        let edit = {id:this.id, field:"connections",  action:"remove", value:{source:source_id, destination:destination_id}};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.connections = this.connections.filter((item)=>{
            return item.source !== source_id && item.destination !== destination_id;
        });
        store.dispatch(update_emulator(this.deep_copy()));
    }

    add_port_link = async (source, destination, progressive) =>{
       let link= {
            id: progressive,
                source_port:"",
                source_channel:-1,
                destination_port:"",
                destination_channel:-1
        };
        let edit = {
            id:this.id,
            field:"port_link",
            action:"add",
            value:{
                core:{source:source, destination:destination},
                link:link
            }};
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);

        let dma_obj = this.connections.filter((item)=>{
            return item.source_core === source && item.destination_core === destination;
        })[0];
        dma_obj.ports.push(link);

        store.dispatch(update_emulator(this.deep_copy()));
    }

    edit_port_link = async (
            source,
            destination,
            field,
            value,
            link_id
        ) =>{
            let dma_obj = this.connections.filter((item)=>{
                return item.source_core === source && item.destination_core === destination;
            })[0];
            let edited_channel = null;
            let next_channels = dma_obj.ports.map((item)=>{
                if(item.id === link_id){
                    edited_channel =  {...item, ...{[field]:value}};
                    return edited_channel;
                } else {
                    return item;
                }
            })

            let edit = {
                id:this.id,
                field:"port_link",
                action:"edit",
                value:{
                    core:{source:source, destination:destination},
                    link_id:link_id,
                    update_object:edited_channel
                }
            };
            await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
            dma_obj.ports = next_channels;
            store.dispatch(update_emulator(this.deep_copy()));
        }


    remove_link_id =  async (source, destination, link_id) =>{
        let edit = {
            id:this.id,
            field:"port_link",
            action:"remove",
            value:{
                source:source,
                destination:destination,
                link_id:link_id
            }
        };
        await backend_patch(api_dictionary.emulators.edit+'/'+this.id, edit);
        this.connections = this.connections.map((item)=>{
            if(item.source_core === source && item.destination_core === destination){
                let ret = item;
                ret.ports = ret.ports.filter((item)=>{
                    return item.id !== link_id;
                })
                return ret;
            } else {
                return item;
            }
        });
        store.dispatch(update_emulator(this.deep_copy()));
    }

    remove_node_connections =async (node_id) =>{

        for(let c of this.connections){
            if(c.source === node_id || c.destination === node_id) {
                await this.remove_dma_connection(c.source, c.destination);
            }
        }

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

    get_series_for_input(input_data, input_obj, n_channels){

        let ret = [];
        let tok = input_obj.source.value.split(".");
        for(let d of input_data){
            if(d.name === tok[0]){
                if(n_channels > 1){
                    for(let i = 0; i < n_channels; i++){
                        let name = tok[1] + "[" + i + "]";
                        if(d.data[name]){
                            ret.push(d.data[name]);
                        } else {
                            throw("Error: " + name + " not found in selected file")
                        }
                    }
                } else {
                    ret = d.data[tok[1]]
                }

            }
        }
        return ret;
    }

    build = () =>{
        let connections  = [];
        this.connections.map((item) => {
            let source_core = this.cores[item.source_core].name;
            let dest_core = this.cores[item.destination_core].name;
            connections = [...connections, ...item.ports.map((item) => {
                return {
                    source: source_core + "." + item.source_port,
                    source_channel:item.source_channel,
                    destination: dest_core + "." +  item.destination_port,
                    destination_channel:item.destination_channel
                };
            })];
        });
        return {
            version:2,
            cores: Object.values(this.cores).map((item) => {
                return ({
                    id: item.name,
                    order: item.order,
                    inputs: item.inputs.map((in_obj) => {
                        let source = in_obj.source;
                        if(in_obj.source.type === "series"){
                            source = {
                                type: in_obj.source.type,
                                value: this.get_series_for_input(item.input_data, in_obj, item.channels)
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
                            vector_size: in_obj.vector_size,
                            is_vector: in_obj.is_vector
                        };
                    }),
                    outputs: item.outputs.map((out) => {
                        return {
                            name: out.name,
                            is_vector: out.is_vector,
                            vector_size: out.vector_size,
                            metadata:{
                                type: out.type,
                                width: out.width,
                                signed: out.signed,
                                common_io:false
                            }
                        };
                    }),
                    memory_init: item.memory_init.map((mem) => {
                        let init_val = [];
                        if(mem.vector_size > 1){
                            for (let i = 0; i < mem.vector_size; i++) {
                                init_val.push(parseInt(mem.value));
                            }
                        }else if(item.channels > 1){
                            if(mem.value.includes && mem.value.includes(",")){
                                let values = mem.value.split(",");
                                for (let i = 0; i < item.channels; i++) {
                                    init_val.push(parseInt(values[i]));
                                }
                            } else {
                                let val = parseInt(mem.value);
                                for (let i = 0; i < item.channels; i++) {
                                    init_val.push(val);
                                }
                            }

                        } else {
                            init_val.push(parseInt(mem.value));
                        }

                        return {
                            name: mem.name,
                            vector_size: mem.vector_size,
                            metadata:{
                                type: mem.type,
                                width: mem.width,
                                signed: mem.signed,
                            },
                            is_output: mem.is_output,
                            is_input: mem.is_input,
                            is_vector:mem.is_vector,
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
                            return store.getState().programs[h].content;
                        })
                        return {content: prog.content, headers:headers};
                    })(),
                    options: item.options,
                    sampling_frequency: item.sampling_frequency
                })
            }),
            interconnect: connections,
            emulation_time:this.emulation_time,
            deployment_mode:this.deployment_mode
        };
    }

    emulator_run = async () =>{
        let specs = this.build();
        return await backend_post(api_dictionary.operations.hil_emulate, specs);
    };

    disassemble = async () =>{
        let specs = this.build();
        return await backend_post(api_dictionary.operations.hil_disassemble, specs);
    }

    download_hardware_sim_data = async () =>{
        let specs = this.build();
        let bus_data = await backend_post(api_dictionary.operations.hil_hardware_sim, specs);
        bus_data.control = bus_data.control + "--\n" + bus_data.outputs;
        bus_data.inputs = this.prepare_input_series(bus_data.inputs);
        return bus_data;
    }

    float_to_hex = (series) =>{
        return series.map((item)=>{
            const buffer = new ArrayBuffer(4);
            const view = new DataView(buffer);
            view.setFloat32(0, item, true);
            return view.getUint32(0, true);
        })
    }

    prepare_input_series = (raw_specs)=>{
        let series_order = {};
        let series_header = {};
        raw_specs.split("\n").map((line, idx)=>{
            let components = line.split(",");
            if(components.length === 5){
                series_header[idx] = components.slice(1, components.length).join(",");
                series_order[components[0]] = idx;
            }
        })

        let series_data = {};
        for(let o in series_order){
            Object.values(this.cores).map((core)=>{
                core.inputs.map((in_obj)=>{
                    if(in_obj.source.type === "series"){
                        let series = this.get_series_for_input(
                            core.input_data,
                            in_obj,
                            core.channels
                        );
                        if(o === core.name + "." + in_obj.name){
                            series_data[series_order[o]] = this.float_to_hex(series);
                        } else {
                            for(let i = 0; i<series.length; i++){
                                let data_name = core.name.replace(" ", "_")+ "[" + i.toString() + "]" +  "." + in_obj.name.replace(" ", "_");
                                if(o === data_name){
                                    series_data[series_order[o]] = this.float_to_hex(series[i]);
                                    break;
                                }
                            }
                        }


                    }
                });
            })
        }


        let serialized_data = "";
        for(let i in series_data){
            serialized_data += series_header[i] + ";";
        }
        serialized_data = serialized_data.slice(0, -1) + "\n";
        if(Object.keys(series_data) .length === 0) return serialized_data;
        for(let j = 0; j<Object.values(series_data)[0].length; j++){
            let row_data = [];
            for(let i in series_data){
                row_data.push(series_data[i][j]);
            }
            serialized_data += row_data.join(",") + "\n";
        }
        return serialized_data;
    }

    deploy = async () =>{
        let specs = this.build();
        return await backend_post(api_dictionary.operations.hil_deploy, specs);
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
        return backend_post(api_dictionary.operations.hil_select_output, {channel:channel, output:output});
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
        return backend_post(api_dictionary.operations.hil_set_input, {"address":address, "value":value, "core": core});
    }

    start_hil = () =>{
        return backend_get(api_dictionary.operations.hil_start);
    }
    stop_hil = () =>{
        return backend_get(api_dictionary.operations.hil_stop);
    }

    debug_init = async () =>{
        return await backend_post(api_dictionary.operations.hil_debug, {
            command: "initialize",
            arguments: this.build()
        });
    }

    add_breakpoint = async (core_id, line_n) =>{
        return await backend_post(api_dictionary.operations.hil_debug, {
            command: "add_breakpoint",
            arguments: {id:core_id, line:line_n},
        });
    }

    get_breakpoints = async (core_id) =>{
        return await backend_post(api_dictionary.operations.hil_debug, {
            command: "get_breakpoints",
            arguments: {id:core_id},
        });
    }

    remove_breakpoint = async (core_id, line_n) =>{
        return await backend_post(api_dictionary.operations.hil_debug, {
            command: "remove_breakpoint",
            arguments: {id:core_id, line:line_n},
        });
    }

    step_over = async (core_id) =>{
        return await backend_post(api_dictionary.operations.hil_debug, {
            command: "step",
            arguments: core_id
        });
    }

    resume = async (core_id) =>{
        return await backend_post(api_dictionary.operations.hil_debug, {
            command: "resume",
            arguments: core_id
        });
    }

    debug_run = async () =>{
        return await backend_post(api_dictionary.operations.hil_debug, {
            command: "run",
            arguments:this.id
        });
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
