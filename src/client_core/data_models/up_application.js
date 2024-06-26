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

import {get_channels_from_group, set_scaling_factors, store, up_peripheral, up_program} from "../index";
import {backend_get, backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {addApplication, removeApplication} from "../../redux/Actions/applicationActions";
import  objectHash from "object-hash";
import {set_scope_address} from "../proxy/plot";
import {setSetting} from "../../redux/Actions/SettingsActions";


export class up_application {
    constructor(app_data_obj) {
        if(!app_data_obj){
            return;
        }
        this.id = app_data_obj.id;
        this.application_name = app_data_obj.application_name;
        this.bitstream = app_data_obj.bitstream;
        this.channels = app_data_obj.channels;
        this.channel_groups = app_data_obj.channel_groups;
        this.pl_clocks = app_data_obj.pl_clocks;
        this.initial_registers_values = app_data_obj.initial_registers_values;
        this.macro = app_data_obj.macro;
        this.parameters = app_data_obj.parameters;
        this.peripherals = app_data_obj.peripherals;
        this.soft_cores = app_data_obj.soft_cores;
        this.filters = app_data_obj.filters;
        this.programs = app_data_obj.programs;
        this.scripts = app_data_obj.scripts;
        this.miscellaneous = app_data_obj.miscellaneous;
    }

    static construct_empty(app_id){
        let app_data_obj = {
            id: app_id,
            application_name:'new application_'+app_id,
            bitstream:"",
            channels:[],
            channel_groups:[],
            pl_clocks:{
                "0":100e6,
                "1":100e6,
                "2":100e6,
                "3":100e6
            },
            initial_registers_values:[],
            macro:[],
            parameters:[],
            peripherals:[],
            soft_cores:[],
            filters:[],
            programs:[],
            scripts:[],
            miscellaneous:{}
        };
        return new up_application(app_data_obj);
    }

    add_remote = () => {
        store.dispatch(addApplication({[this.id]:this}))
        return backend_post(api_dictionary.applications.add, this._get_app());
    }

    set_active = async () => {
        await backend_get(api_dictionary.applications.set + '/' + this.id);
        for(let i in this.pl_clocks){
            await this.set_global_clock_frequency(parseInt(i), this.pl_clocks[i]);
        }
        await this.load_irv();
        await this.setup_scope();
        return this.load_soft_cores();
    }

    setup_scope = async () =>{

        let [channels, ] = this.get_scope_setup_info();
        if(this.miscellaneous.scope_mux_address){
            for(let item of channels){
                if(item){
                    let channel_address = parseInt(this.miscellaneous.scope_mux_address) + 4*(parseInt(item.number)+1);
                    await up_peripheral.direct_register_write([[channel_address, parseInt(item.mux_setting)]])
                }
            }
            await set_scope_address({address:parseInt(this.miscellaneous.scope_mux_address), dma_buffer_offset:0x208})
        }

        if(channels.length !== 0){
            let sfs = Array(6).fill(1);
            for(let item of channels){
                if(item.scaling_factor){
                    sfs[parseInt(item.number)] = parseFloat(item.scaling_factor);
                }
            }
            await set_scaling_factors(sfs);
        }
    }

    load_irv = () =>{
        let writes = [];
        for(let i of this.initial_registers_values){
            writes.push({type:"direct", access_type:"full_reg", proxy_type:"", proxy_address:0, address:i.address, value:i.value})
        }

        return backend_post(api_dictionary.peripherals.bulk_write, {payload:writes})
    }

    load_soft_cores = async () =>{
        let error_cores = [];
        for (let core of this.soft_cores){
            let result = await this.load_core(core);
            if(result[0].status !=="passed"){
                error_cores.push(core.id)
            }
        }
        return error_cores;
    }

    set_global_clock_frequency = async (clock_n, frequency) =>{
        return backend_post(api_dictionary.applications.clock,
            {
                type:"global",
                clock_n: clock_n,
                frequency: frequency
            }
        )
    }

    get_global_clock_frequency = async (clock_n) =>{
        let clocks = await backend_get(api_dictionary.applications.clock);
        return clocks[clock_n];
    }

    load_core = (core, program) =>{

        let selected_program = {};
        if(program){
            selected_program = new up_program(program);
        } else {
            selected_program = new up_program(Object.values(store.getState().programs).filter((p) => {
                return p.name === core.default_program;
            })[0])
        }
        return selected_program.load(core);
    }

    get_scope_setup_info = () =>{
        let channels_list = [];
        let default_group = {}
        for(let group of this.channel_groups){
            if(group.default){
                default_group = group;
                channels_list = get_channels_from_group(group, this.channels);
            }
        }
        return [channels_list, default_group]
    }





    add_channel = (ch_name) =>{
        let ch = {
            name: ch_name,
            id: ch_name.replace(/\s/g, "_").toLowerCase(),
            number: 0,
            mux_setting: 0,
            enabled: false,
            scaling_factor:1,
        };
        this.channels.push(ch);
        let edit = {
            application:this.id,
            item:ch,
            action:"add",
            object:"channel"
        };
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
        let edit = {application:this.id, item:chg, action:"add", object:"channel_group"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_irv = (irv_address) =>{
        let irv = {
            address:irv_address,
            value:0
        }
        this.initial_registers_values.push(irv);
        let edit = {application:this.id, item:irv, action:"add", object:"irv"};
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_macro = (macro_name) => {
        let m =  {
            name: macro_name,
            trigger: ""
        };
        this.macro.push(m);
        let edit = {application:this.id, item:m, action:"add", object:"macro"};
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
        let edit = {application:this.id, item:p, action:"add", object:"parameter"};
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
        let edit = {application:this.id, item:p, action:"add", object:"peripheral"};
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
        let edit = {application:this.id, item:f, action:"add", object:"filter"};
        this.filters.push(f);
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_selected_script = (script_id) =>{
        let edit = {application:this.id, item:script_id, action:"add", object:"selected_script"};
        this.scripts.push(script_id);
        return backend_post(api_dictionary.applications.edit, edit);
    }

    add_selected_program = (program_id) =>{
        let edit = {application:this.id, item:program_id, action:"add", object:"selected_program"};
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
        let edit = {application:this.id, item:sc, action:"add", object:"soft_core"};
        this.soft_cores.push(sc);
        return backend_post(api_dictionary.applications.edit, edit);
    }

    set_misc_param = (param_name) =>{
        let edit = {application:this.id, item: {name:param_name, value:"0"}, action:"add", object:"misc"};
        this.miscellaneous[param_name] = 0;
        store.dispatch(addApplication({[this.id]:this}))
        return backend_post(api_dictionary.applications.edit, edit);

    }

    ////////////////////////////////////////////////////

    edit_clock_frequency = (clock_id, frequency) =>{
        this.pl_clocks[clock_id] = frequency;
        let edit = {
            application:this.id,
            item:{
                item_id:clock_id,
                value:frequency
            },
            action:"edit",
            object:"pl_clocks"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_channel = (channel_name, field_name, field_value) =>{
        let [channel] = this.channels.filter((ch) =>{
            return ch.name === channel_name;
        })
        channel[field_name] = field_value;
        let edit = {
            application:this.id,
            item:{
                item_id:channel_name,
                field:field_name,
                value:field_value
            },
            action:"edit",
            object:"channel"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_channel_group = (chg_name, field_name,field_value) =>{
        let [group] = this.channel_groups.filter((chg) =>{
            return chg.group_name === chg_name;
        })
        group[field_name] = field_value;
        let edit = {
            application:this.id,
            item:{
                item_id:chg_name,
                field:field_name,
                value:field_value
            },
            action:"edit",
            object:"channel_group"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_irv = (address,field_name, field_value) =>{
        let [irv] = this.initial_registers_values.filter((i) =>{
            return i.address === address;
        })
        irv[field_name] = field_value;
        let edit = {
            application:this.id,
            item:{
                item_id:address,
                field:field_name,
                value:field_value
            },
            action:"edit",
            object:"irv"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_macro = (macro_name, field_name, field_value) => {

        let [macro] = this.macro.filter((m) =>{
            return m.name === macro_name;
        })

        macro[field_name] = field_value;
        let edit = {
            application:this.id,
            item:{
                item_id:macro_name,
                field:field_name,
                value:field_value
            },
            action:"edit",
            object:"macro"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_parameters = (param_id, field_name, field_value) =>{

        let [param] = this.parameters.filter((p) =>{
            return p.parameter_id === param_id;
        })

        param[field_name] = field_value;
        let edit = {
            application:this.id,
            item:{
                item_id:param_id,
                field:field_name,
                value:field_value
            },
            action:"edit",
            object:"parameter"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_peripheral = (periph_name, field_name, field_value) => {

        let [periph] = this.peripherals.filter((p) =>{
            return p.name === periph_name;
        })

        periph[field_name] = field_value;

        let edit = {
            application:this.id,
            item:{
                item_id:periph_name,
                field:field_name,
                value:field_value
            },
            action:"edit",
            object:"peripheral"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_filter = (filter_id, field_name, field_value) =>{

        let [filter] = this.filters.filter((f) =>{
            return f.id === filter_id;
        })

        filter[field_name] = field_value;
        let edit = {
            application:this.id,
            item:{
                item_id:filter_id,
                field:field_name,
                value:field_value
            },
            action:"edit",
            object:"filter"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_misc_param = (param_name, param_value, rename_param) =>{

        let edit = {}
        if(rename_param){
            edit =  {
                application:this.id,
                item:{
                    name:param_name,
                    value:param_value,
                    edit_name:true
                },
                action:"edit",
                object:"misc"
            };
            this.miscellaneous[param_value] = this.miscellaneous[param_name];
            delete this.miscellaneous[param_name];
        } else {
            edit = {
                application:this.id,
                item:{
                    name:param_name,
                    value:param_value,
                    edit_name:false
                },
                action:"edit",
                object:"misc"
            };
            this.miscellaneous[param_name] = param_value;
        }
        store.dispatch(addApplication({[this.id]:this}))
        return backend_post(api_dictionary.applications.edit, edit);
    }

    edit_soft_core = (core_id, field_name, field_value) =>{
        let [core] = this.soft_cores.filter((sc) =>{
            return sc.id === core_id;
        });

        core[field_name] = field_value;
        let edit = {
            application:this.id,
            item:{
                item_id:core_id,
                field:field_name,
                value:field_value
            },
            action:"edit",
            object:"soft_core"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    ////////////////////////////////////////////////////
    remove_channel = (ch_id) =>{
        let idx = this.channels.findIndex((ch) =>{
            return ch.id === ch_id;
        })
        this.channels.splice(idx,1);

        let edit = {
            application:this.id,
            item:ch_id,
            action:"remove",
            object:"channel"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_channel_groups = (chg_id) =>{
        let idx = this.channel_groups.findIndex((chg) =>{
            return chg.group_id === chg_id;
        })
        this.channel_groups.splice(idx,1);

        let edit = {
            application:this.id,
            item:chg_id,
            action:"remove",
            object:"channel_group"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_irv = (address) =>{
        let idx  = this.initial_registers_values.filter((i) =>{
            return i.address === address;
        })
        this.initial_registers_values.splice(idx,1);

        let edit = {
            application:this.id,
            item:address,
            action:"remove",
            object:"irv"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_macro = (macro_name) => {
        let idx  = this.macro.filter((m) =>{
            return m.name === macro_name;
        })
        this.macro.splice(idx,1);

        let edit = {
            application:this.id,
            item:macro_name,
            action:"remove",
            object:"macro"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_parameter = (param_id) =>{
        let idx = this.parameters.filter((p) =>{
            return p.parameter_id === param_id;
        })
        this.parameters.splice(idx,1);

        let edit = {
            application:this.id,
            item:param_id,
            action:"remove",
            object:"parameter"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_peripheral = (periph_id) => {
        let idx = this.peripherals.filter((p) =>{
            return p.peripheral_id === periph_id;
        })
        this.peripherals.splice(idx,1);

        let edit = {
            application:this.id,
            item:periph_id,
            action:"remove",
            object:"peripheral"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_soft_core = (core_id) => {
        let idx = this.soft_cores.filter((sc) =>{
            return sc.id === core_id;
        })
        this.soft_cores.splice(idx,1);

        let edit = {
            application:this.id,
            item:core_id,
            action:"remove",
            object:"soft_core"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_filter = (filter_id) => {
        let idx = this.filters.filter((f) =>{
            return f.id === filter_id;
        })
        this.filters.splice(idx,1);

        let edit = {
            application:this.id,
            item:filter_id,
            action:"remove",
            object:"filter"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_selected_script = (script_id) => {
        let idx = this.scripts.indexOf(script_id)
        this.scripts.splice(idx,1);

        let edit = {
            application:this.id,
            item:script_id,
            action:"remove",
            object:"selected_script"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_selected_program = (program_id) => {
        let idx = this.programs.indexOf(program_id)
        this.programs.splice(idx,1);

        let edit = {
            application:this.id,
            item:program_id,
            action:"remove",
            object:"selected_program"
        };
        return backend_post(api_dictionary.applications.edit, edit);
    }

    remove_misc_field = (field_name) =>{
        delete this.miscellaneous[field_name]
        let edit = {
            application:this.id,
            item:field_name,
            action:"remove",
            object:"misc"
        };
        store.dispatch(addApplication({[this.application_name]:this}))
        return backend_post(api_dictionary.applications.edit, edit);
    }

    static delete(app){
        return backend_get(api_dictionary.applications.remove+'/'+app.id).then(()=>{
            store.dispatch(removeApplication(app.id));
        })
    }

    get_raw_obj = () => {
        return this._get_app();
    }

    _get_app = () =>{
        let ret_obj = {
            [this.application_name]:{
                id:this.id,
                application_name:this.application_name,
                bitstream:this.bitstream,
                channels:this.channels,
                channel_groups:this.channel_groups,
                pl_clocks:this.pl_clocks,
                initial_registers_values:this.initial_registers_values,
                macro:this.macro,
                parameters:this.parameters,
                peripherals:this.peripherals,
                soft_cores:this.soft_cores,
                filters:this.filters,
                scripts:this.scripts,
                programs:this.programs,
                miscellaneous:this.miscellaneous
            }
        };
        return ret_obj;
    }
}
