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
import {
    create_channel,
    create_channel_group,
    create_irv,
    create_macro,
    create_parameter, create_peripheral_entry
} from "../../utilities/ApplicationUtilities";
import {backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {addApplicationDone} from "../../redux/Actions/applicationActions";


export class up_application {
    constructor(app_data_obj) {
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

        let nonstandard_fields =  up_application._get_nonstandard_fields(app_data_obj);
        for(let i of nonstandard_fields){
            this[i] = app_data_obj[i];
        }
    }

    static construct_empty(app_name){
        let app_data_obj = {application_name:app_name, bitstream:"", channels:[],channel_groups:[],clock_frequency:100000000,
            initial_registers_values:[], macro:[],n_enables:0,parameters:[],peripherals:[],timebase_address:""};
        return new up_application(app_data_obj);
    }

    add_remote = () => {
        store.dispatch(addApplicationDone({[this.application_name]:this}))
        return backend_post(api_dictionary.applications.add, this._get_app());
    }


    add_channel = (ch_name) =>{
        let ch = create_channel(ch_name)
        this.channels.push(ch);
        let edit = {application:this.application_name, channel:ch, action:"add_channel"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_channel_group = (chg_name) =>{
        let chg = create_channel_group(chg_name)
        this.channel_groups.push(chg);
        let edit = {application:this.application_name, group:chg, action:"add_channel_group"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_irv = (irv_address) =>{
        let irv = create_irv(irv_address)
        this.initial_registers_values.push(irv);
        let edit = {application:this.application_name, irv:irv, action:"add_irv"};
        return backend_post(api_dictionary.applications.edit, edit);
    }
    add_macro = (macro_name) => {
        let m = create_macro(macro_name);
        this.macro.push(m);
        let edit = {application:this.application_name, macro:m, action:"add_macro"};
        return backend_post(api_dictionary.applications.edit, edit);
    }
    add_parameter = (parameter_name) =>{
        let p = create_parameter(parameter_name);
        this.parameters.push(p)
        let edit = {application:this.application_name, parameter:p, action:"add_parameter"};
        return backend_post(api_dictionary.applications.edit, edit);
    }
    add_peripheral = (peripheral_name) => {
        let p = create_peripheral_entry(peripheral_name);
        let edit = {application:this.application_name, peripheral:p, action:"add_peripheral"};
        this.peripherals.push(p);
        return backend_post(api_dictionary.applications.edit, edit);
    }

    set_misc_param = (param_name) =>{
        let edit = {application:this.application_name, field: {name:param_name, value:"0"}, action:"add_misc"};
        this[param_name] = 0;
        store.dispatch(addApplicationDone({[this.application_name]:this}))
        return backend_post(api_dictionary.applications.edit, edit);

    }

    ////////////////////////////////////////////////////
    edit_channel = (ch_id, field_name, field_value) =>{
        let [channel] = this.channels.filter((ch) =>{
            return ch.id === ch_id;
        })
        channel[field_name] = field_value;
        let edit = {application:this.application_name, channel:ch_id, field:field_name, value:field_value, action:"edit_channel"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_channel_group = (chg_id, field_name,field_value) =>{
        let [group] = this.channel_groups.filter((chg) =>{
            return chg.group_id === chg_id;
        })
        group[field_name] = field_value;
        let edit = {application:this.application_name, group:chg_id, field:field_name, value:field_value, action:"edit_channel_group"};
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

    edit_peripheral = (periph_id, field_name, field_value) => {

        let [periph] = this.peripherals.filter((p) =>{
            return p.peripheral_id === periph_id;
        })

        periph[field_name] = field_value;
        let edit = {application:this.application_name, peripheral:periph_id, field:field_name, value:field_value, action:"edit_peripheral"};
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

    remove_misc_field = (field_name) =>{
        delete this[field_name]
        let edit = {application:this.application_name, field:{name:field_name}, action:"remove_misc"};
        return backend_post(api_dictionary.applications.edit, edit);
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
                timebase_address:this.timebase_address
            }
        };
        for (const x of misc_params) {
            ret_obj[this.application_name][x] = this[x];
        }
        return ret_obj;
    }
}