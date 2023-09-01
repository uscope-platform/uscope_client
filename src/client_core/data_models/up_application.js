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
import {backend_get, backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {addApplication, removeApplication} from "../../redux/Actions/applicationActions";


export class up_application {
    constructor(app_data_obj) {
        if(!app_data_obj){
            return;
        }
        this.application_name = app_data_obj.application_name;
        this.bitstream = app_data_obj.bitstream;
        this.channels = app_data_obj.channels;
        this.channel_groups = app_data_obj.channel_groups;
        this.clock_frequency = app_data_obj.clock_frequency;
        this.initial_registers_values = app_data_obj.initial_registers_values;
        this.macro = app_data_obj.macro;
        this.n_enables = app_data_obj.n_enables;
        this.parameters = app_data_obj.parameters;
        this.peripherals = app_data_obj.peripherals;
        this.timebase_address = app_data_obj.timebase_address;
        this.soft_cores = app_data_obj.soft_cores;
        this.filters = app_data_obj.filters;
        this.programs = app_data_obj.programs;
        this.scripts = app_data_obj.scripts;
        let nonstandard_fields =  up_application._get_nonstandard_fields(app_data_obj);
        for(let i of nonstandard_fields){
            this[i] = app_data_obj[i];
        }
    }

    static construct_empty(app_name){
        let app_data_obj = {
            application_name:app_name,
            bitstream:"",
            channels:[],
            channel_groups:[],
            clock_frequency:100000000,
            initial_registers_values:[],
            macro:[],
            n_enables:0,
            parameters:[],
            peripherals:[],
            timebase_address:"",
            soft_cores:[],
            filters:[],
            programs:[],
            scripts:[],
        };
        return new up_application(app_data_obj);
    }

    add_remote = () => {
        store.dispatch(addApplication({[this.application_name]:this}))
        return backend_post(api_dictionary.applications.add, this._get_app());
    }

    set_active = () => {
        return backend_get(api_dictionary.applications.set + '/' + this.application_name)
    }

    add_channel = (ch_name) =>{
        let ch = {
            name: ch_name,
            id: ch_name.replace(/\s/g, "_").toLowerCase(),
            phys_width:16,
            number: 0,
            mux_setting: 0,
            enabled: false,
            max_value: "1000",
            min_value: "0",
            scaling_factor:1
        };
        this.channels.push(ch);
        let edit = {application:this.application_name, channel:ch, action:"add_channel"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_channel_group = (chg_name) =>{
        let chg = {
            group_name: chg_name,
            group_id: chg_name.replace(/\s/g, "_").toLowerCase(),
            channels:[],
            default:false
        };
        this.channel_groups.push(chg);
        let edit = {application:this.application_name, group:chg, action:"add_channel_group"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_irv = (irv_address) =>{
        let irv = {
            address:irv_address,
            value:"0"
        }
        this.initial_registers_values.push(irv);
        let edit = {application:this.application_name, irv:irv, action:"add_irv"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_macro = (macro_name) => {
        let m =  {
            name: macro_name,
            trigger: ""
        };
        this.macro.push(m);
        let edit = {application:this.application_name, macro:m, action:"add_macro"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_parameter = (parameter_name) =>{
        let p = {
            parameter_name: parameter_name,
            parameter_id: parameter_name.replace(/\s/g, "_").toLowerCase(),
            trigger: '',
            value: '0',
            visible: false
        };
        this.parameters.push(p)
        let edit = {application:this.application_name, parameter:p, action:"add_parameter"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_peripheral = (peripheral_name) => {
        let p = {
            name: peripheral_name,
            peripheral_id: peripheral_name.replace(/\s/g, "_").toLowerCase(),
            base_address: '0',
            hdl_parameters:{},
            proxied: false,
            proxy_address:'0',
            type: 'Registers',
            spec_id: ""
        };
        let edit = {application:this.application_name, peripheral:p, action:"add_peripheral"};
        this.peripherals.push(p);
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_filter = (filter_id) =>{
        let f = {
            id:filter_id,
            filter_name:"",
            peripheral:"",
            enabled:false
        };
        let edit = {application:this.application_name, filter:f, action:"add_filter"};
        this.filters.push(f);
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_selected_script = (script_id) =>{
        let edit = {application:this.application_name, script:script_id, action:"add_selected_script"};
        this.scripts.push(script_id);
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_selected_program = (program_id) =>{
        let edit = {application:this.application_name, program:program_id, action:"add_selected_program"};
        this.programs.push(program_id);
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_soft_core = (core_id) => {
        let sc = {
            id: core_id,
            address: 0x0,
            default_program:"",
            io:[]
        }
        let edit = {application:this.application_name, soft_core:sc, action:"add_soft_core"};
        this.soft_cores.push(sc);
        return backend_post(api_dictionary.applications.edit, edit);
    }

    set_misc_param = (param_name) =>{
        let edit = {application:this.application_name, field: {name:param_name, value:"0"}, action:"add_misc"};
        this[param_name] = 0;
        store.dispatch(addApplication({[this.application_name]:this}))
        return backend_post(api_dictionary.applications.edit, edit);

    }

    ////////////////////////////////////////////////////
    edit_channel = (channel_name, field_name, field_value) =>{
        let [channel] = this.channels.filter((ch) =>{
            return ch.name === channel_name;
        })
        channel[field_name] = field_value;
        let edit = {application:this.application_name, channel:channel_name, field:field_name, value:field_value, action:"edit_channel"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_channel_group = (chg_name, field_name,field_value) =>{
        let [group] = this.channel_groups.filter((chg) =>{
            return chg.group_name === chg_name;
        })
        group[field_name] = field_value;
        let edit = {application:this.application_name, group:chg_name, field:field_name, value:field_value, action:"edit_channel_group"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_irv = (address,field_name, field_value) =>{
        let [irv] = this.initial_registers_values.filter((i) =>{
            return i.address === address;
        })
        irv[field_name] = field_value;
        let edit = {application:this.application_name, address:address, field:field_name, value:field_value, action:"edit_irv"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_macro = (macro_name, field_name, field_value) => {

        let [macro] = this.macro.filter((m) =>{
            return m.name === macro_name;
        })

        macro[field_name] = field_value;
        let edit = {application:this.application_name, name:macro_name, field:field_name, value:field_value, action:"edit_macro"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_parameters = (param_id, field_name, field_value) =>{

        let [param] = this.parameters.filter((p) =>{
            return p.parameter_id === param_id;
        })

        param[field_name] = field_value;
        let edit = {application:this.application_name, parameter:param_id, field:field_name, value:field_value, action:"edit_parameter"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_peripheral = (periph_name, field_name, field_value) => {

        let [periph] = this.peripherals.filter((p) =>{
            return p.name === periph_name;
        })

        periph[field_name] = field_value;
        let edit = {application:this.application_name, peripheral:periph_name, field:field_name, value:field_value, action:"edit_peripheral"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_filter = (filter_id, field_name, field_value) =>{

        let [filter] = this.filters.filter((f) =>{
            return f.id === filter_id;
        })

        filter[field_name] = field_value;
        let edit = {application:this.application_name, filter:filter_id, field:field_name, value:field_value, action:"edit_filter"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_misc_param = (param_name, param_value, rename_param) =>{

        let edit = {}
        if(rename_param){
            edit =  {application:this.application_name, field: {old_name:param_name, name:param_value}, action:"edit_misc"};
            this[param_value] = this[param_name];
            delete this[param_name];
        } else {
            edit = {application:this.application_name, field: {old_name:null, name:param_name, value:param_value}, action:"edit_misc"};
            this[param_name] = param_value;
        }
        store.dispatch(addApplication({[this.application_name]:this}))
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_soft_core = (core_id, field_name, field_value) =>{
        let [core] = this.soft_cores.filter((sc) =>{
            return sc.id === core_id;
        });

        core[field_name] = field_value;
        let edit = {application:this.application_name, core:core_id, field:field_name, value:field_value, action:"edit_soft_core"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    ////////////////////////////////////////////////////
    remove_channel = (ch_id) =>{
        let idx = this.channels.findIndex((ch) =>{
            return ch.id === ch_id;
        })
        this.channels.splice(idx,1);

        let edit = {application:this.application_name, channel:ch_id, action:"remove_channel"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_channel_groups = (chg_id) =>{
        let idx = this.channel_groups.findIndex((chg) =>{
            return chg.group_id === chg_id;
        })
        this.channel_groups.splice(idx,1);

        let edit = {application:this.application_name, group:chg_id, action:"remove_channel_group"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_irv = (address) =>{
        let idx  = this.initial_registers_values.filter((i) =>{
            return i.address === address;
        })
        this.initial_registers_values.splice(idx,1);

        let edit = {application:this.application_name, address:address, action:"remove_irv"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_macro = (macro_name) => {
        let idx  = this.macro.filter((m) =>{
            return m.name === macro_name;
        })
        this.macro.splice(idx,1);

        let edit = {application:this.application_name, name:macro_name, action:"remove_macro"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_parameter = (param_id) =>{
        let idx = this.parameters.filter((p) =>{
            return p.parameter_id === param_id;
        })
        this.parameters.splice(idx,1);

        let edit = {application:this.application_name, parameter:param_id, action:"remove_parameter"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_peripheral = (periph_id) => {
        let idx = this.peripherals.filter((p) =>{
            return p.peripheral_id === periph_id;
        })
        this.peripherals.splice(idx,1);

        let edit = {application:this.application_name, peripheral:periph_id, action:"remove_peripheral"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_soft_core = (core_id) => {
        let idx = this.soft_cores.filter((sc) =>{
            return sc.id === core_id;
        })
        this.soft_cores.splice(idx,1);

        let edit = {application:this.application_name, core:core_id, action:"remove_soft_core"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_filter = (filter_id) => {
        let idx = this.filters.filter((f) =>{
            return f.id === filter_id;
        })
        this.filters.splice(idx,1);

        let edit = {application:this.application_name, filter:filter_id, action:"remove_filter"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_selected_script = (script_id) => {
        let idx = this.scripts.indexOf(script_id)
        this.scripts.splice(idx,1);

        let edit = {application:this.application_name, script:script_id, action:"remove_selected_script"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_selected_program = (program_id) => {
        let idx = this.programs.indexOf(program_id)
        this.programs.splice(idx,1);

        let edit = {application:this.application_name, program:program_id, action:"remove_selected_program"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_misc_field = (field_name) =>{
        delete this[field_name]
        let edit = {application:this.application_name, field:{name:field_name}, action:"remove_misc"};
        store.dispatch(addApplication({[this.application_name]:this}))
        return backend_post(api_dictionary.applications.edit, edit);
    }

    static delete_application(app){
        return backend_get(api_dictionary.applications.remove+'/'+app).then(()=>{
            store.dispatch(removeApplication(app));
        })
    }

    static _get_nonstandard_fields(obj){
        return Object.keys(obj).filter((field)=>{

            let is_not_function = typeof obj[field] !== 'function';
            let is_standard_field = ["application_name","bitstream", "channels", "channel_groups","clock_frequency",
                "initial_registers_values", "macro", "n_enables", "parameters", "peripherals", "timebase_address"
            ].includes(field);
            return !is_standard_field && is_not_function;
        })
    }

    _get_app = () =>{
        let misc_params = up_application._get_nonstandard_fields(this);
        let ret_obj = {
            [this.application_name]:{
                application_name:this.application_name,
                bitstream:this.bitstream,
                channels:this.channels,
                channel_groups:this.channel_groups,
                clock_frequency:this.clock_frequency,
                initial_registers_values:this.initial_registers_values,
                macro:this.macro,
                n_enables:this.n_enables,
                parameters:this.parameters,
                peripherals:this.peripherals,
                timebase_address:this.timebase_address,
                soft_cores:this.soft_cores
            }
        };
        for (const x of misc_params) {
            ret_obj[this.application_name][x] = this[x];
        }
        return ret_obj;
    }
}
