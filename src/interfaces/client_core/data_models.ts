// Copyright 2025 Filippo Savi
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




// SCRIPT

export interface script {
    id:number,
    name:string,
    path:string,
    content:string,
    triggers:string
}

export interface script_edit {
    id:number,
    field:string,
    value:string
}


//PROGRAM
export interface program {
    id:number,
    name:string,
    type:string,
    content:string,
    headers:number[]
}

export interface program_edit{
    id:number,
    field:string,
    value:string
}
 // SETTINGS
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

// APPLICATION



export interface application {
    [index: string]: any;
    id:number
    application_name:string
    clock_frequency:number,
    bitstream:string,
    channels:channel[],
    channel_groups:channel_group[],
    initial_registers_values:initial_register_value[],
    macro:macro[],
    parameters:parameter[],
    peripherals:peripheral_istance[],
    miscellaneous: {
        [index: string]: any;
    },
    soft_cores:core_load_info[],
    filters:filter[],
    programs: number[],
    scripts: number[],
    pl_clocks: clock_frequencies
}

export interface channel {
    name:string,
    id:string,
    number:number,
    mux_setting:number,
    enabled:boolean,
    scaling_factor: number
}

export interface channel_group{
    group_name: string,
    group_id: string,
    channels:string[],
    default:boolean
}

export interface macro {
    name: string,
    trigger: string
}

export interface parameter {
    parameter_name: string,
    parameter_id: string,
    trigger: string,
    value: string | number,
    visible: boolean
}

export interface peripheral_istance{
    name: string,
    peripheral_id: string,
    base_address: number,
    hdl_parameters: {
        [index: string]: number | string | boolean;
    },
    proxied: boolean
    proxy_address:number,
    type: string,
    spec_id: string
}

export interface soft_core {
    id: string,
    address: number,
    default_program: string,
    io:object
}

export interface filter {
    id:number,
    filter_name:string,
    peripheral:string,
    enabled:boolean
}
export interface clock_frequencies{
    [index: string]: any;
    "0":number,
        "1":number,
        "2":number,
        "3":number
}

export interface initial_register_value{
    address:number,
    value:number
}

export interface core_load_info{
    id: string,
    address: number
    default_program: string,
    io: core_dma_info[]
}

export interface core_dma_info{
    name: string,
    type:string,
    address: number,
    associated_io:string
}


export interface application_edit {
    application:number,
    item:any,
    action:string,
    object:string
}

export interface filter_specifications {
    id:number,
    name:string,
    parameters: {
        [index: string]: any;
    },
    ideal_taps:number[],
    quantized_taps:number[]
}

export interface field {
    name: string,
    description: string,
    length:number,
    offset:number,
    order:number,
    n_fields:string[]
}


export interface register {
    ID:string,
    register_name:string,
    description:string,
    direction:string,
    value:number,
    fields:field[],
    offset?:string,
    order:number,
    n_registers:string[]
}


export interface peripheral {
    id:number,
    name:string,
    version:string,
    registers:register[]
}

export interface resolved_hdl_parameters{
    [index: string]: number;
}