// Copyright 2021 University of Nottingham Ningbo China
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

export let create_channel = (name) =>{
    return {
        name: name,
        id: name.replace(/\s/g, "_").toLowerCase(),
        phys_width:16,
        number: 0,
        mux_setting: 0,
        enabled: false,
        max_value: "1000",
        min_value: "0"
    }
}

export let create_irv = (address) =>{
    return {
        address:address,
        value:"0"
    }
}

export let create_macro = (name) =>{
    return {
        name: name,
        trigger: ""
    }
}

export let create_parameter = (name) =>{
    return {
        parameter_name: name,
        parameter_id: name.replace(/\s/g, "_").toLowerCase(),
        trigger: '',
        value: '0',
        visible: false
    }
}

export let create_peripheral_entry = (name) =>{
    return {
        name: name,
        peripheral_id: name.replace(/\s/g, "_").toLowerCase(),
        base_address: '0',
        proxied: false,
        proxy_address:'0',
        type: 'Registers'
    }
}

export let create_channel_group = (name) =>{
    return{
        group_name: name,
        group_id: name.replace(/\s/g, "_").toLowerCase(),
        channels:[],
        default:false
    }
}
export let create_application_object = (name) =>{
    let app = {}
    app[name] = {
        application_name: name,
        bitstream: '',
        channels: [],
        channel_groups:[],
        clock_frequency: 100000000,
        initial_registers_values: [],
        macro: [],
        n_enables: 0,
        parameters: [],
        peripherals: [],
        timebase_address: ''
    };

    return app;
}