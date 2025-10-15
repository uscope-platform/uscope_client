/*
 * Copyright(c) 2025. Filippo Savi
 * Author: Filippo Savi <filssavi@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

export interface hil_address_map {
    bases: {
        scope_mux: number,
        controller: number,
        hil_control: number,
        noise_generator: number,
        waveform_generator: number,
        cores_control: number,
        cores_inputs: number,
        cores_rom: number
    }
    offsets:{
        controller:number
        cores_control: number,
        dma: number,
        cores_inputs: number,
        cores_rom: number,
        hil_tb: number
    }
}

export interface core_deployment_options{
    rom_address:number,
    control_address:number,
    has_reciprocal:boolean
}

export interface core_options {
    comparators: "none" | "reducing" | "full"
    efi_implementation: "efi_none" | "efi_trig" | "efi_sort"
}


export interface core_input_source{
    type:string,
    value:any,
    file:any,
    series:any
}


export interface core_input{
    name:string,
    type:string,
    width:number,
    signed:boolean,
    common_io:boolean,
    is_vector:boolean,
    vector_size:number,
    source:core_input_source
}

export interface core_output{
    name:string,
    type:string,
    width:number,
    signed:boolean,
    is_vector:boolean,
    vector_size:number
}

export interface core_memory{
    name:string,
    type:string,
    width:number,
    signed:boolean,
    is_input:boolean,
    is_output:boolean,
    is_vector:boolean,
    vector_size:number,
    value:any
}

export interface core_input_data{
    name:string,
    data:any
}

export interface core {
    name: string,
    id: number,
    order:number,
    program: string,
    channels:number,
    inputs:core_input[],
    input_data:core_input_data[],
    outputs:core_output[],
    memory_init:core_memory[],
    options:core_options,
    sampling_frequency:number,
    deployment:core_deployment_options
}
export interface port_link{
    id: number,
    source_port:string,
    destination_port:string,
    source_channel: number,
    destination_channel: number
}
export interface server_side_port_link{
    source: string,
    source_channel:number,
    destination: string,
    destination_channel:number
}
export interface connection {
    source_core:number,
    destination_core:number,
    ports: port_link[]
}


export interface emulator{
    id:number,
    name:string,
    cores: Record<string, core>
    connections:connection[],
    emulation_time:number,
    deployment_mode:boolean
}

export interface emulator_hil_sim_data{
    control: string,
    outputs: string,
    inputs:string
}

export interface hil_data_point{
    label: string,
    core: string,
    name: string,
    channel: number
}