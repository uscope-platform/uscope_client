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

import {
    get_channels_from_group,
    set_channel_status,
    set_scaling_factors,
    store,
    up_peripheral,
    up_program
} from "../index";
import {backend_get, backend_patch, backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {addApplication, removeApplication, updateApplication} from "../../redux/Actions/applicationActions";
import {set_scope_address} from "../proxy/plot";


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

    deep_copy = () =>{
        let ret = {};
        ret.id = this.id;
        ret.application_name = this.application_name;
        ret.bitstream =this.bitstream;
        ret.channels = JSON.parse(JSON.stringify(this.channels));
        ret.channel_groups = JSON.parse(JSON.stringify(this.channel_groups));
        ret.pl_clocks = JSON.parse(JSON.stringify(this.pl_clocks));
        ret.initial_registers_values = JSON.parse(JSON.stringify(this.initial_registers_values));
        ret.macro = JSON.parse(JSON.stringify(this.macro));
        ret.parameters = JSON.parse(JSON.stringify(this.parameters));
        ret.peripherals = JSON.parse(JSON.stringify(this.peripherals));
        ret.soft_cores = JSON.parse(JSON.stringify(this.soft_cores));
        ret.filters = JSON.parse(JSON.stringify(this.filters));
        ret.programs = JSON.parse(JSON.stringify(this.programs));
        ret.scripts = JSON.parse(JSON.stringify(this.scripts));
        ret.miscellaneous = JSON.parse(JSON.stringify(this.miscellaneous));

        return ret;
    }

    add_remote = () => {
        store.dispatch(addApplication({[this.id]:this}))
        return backend_post(api_dictionary.applications.add, this._get_app());
    }

    set_active = async () => {
        await backend_post(api_dictionary.operations.dma_disable, {status:true});
        await backend_get(api_dictionary.operations.load_application + '/' + this.id);
        for(let i in this.pl_clocks){
            await this.set_global_clock_frequency(parseInt(i), this.pl_clocks[i]);
        }
        await this.load_irv();
        await this.setup_scope();
        return this.load_soft_cores();
    }

    setup_scope = async () =>{

        let [channels, ] = this.get_scope_setup_info();
        await this.setup_scope_mux(channels);
        await this.setup_scaling_factors(channels);
        await this.setup_scope_statuses(this.get_channel_statuses(channels));
        await set_scope_address({address:parseInt(this.miscellaneous.scope_mux_address), dma_buffer_offset:0x208})

    }

    load_irv = () =>{
        let writes = [];
        for(let i of this.initial_registers_values){
            writes.push({type:"direct", access_type:"full_reg", proxy_type:"", proxy_address:0, address:i.address, value:i.value})
        }

        return backend_post(api_dictionary.operations.write_registers,writes)
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
        return backend_post(api_dictionary.operations.clock,
            {
                type:"global",
                id: clock_n,
                value: frequency,
                is_primary:true
            }
        )
    }

    get_global_clock_frequency = async (clock_n) =>{
        let clocks = await backend_get(api_dictionary.operations.clock);
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

    get_channel_statuses = (channels)=>{
        let statuses = {};
        for(let item of channels){
            statuses[item.number] = item.enabled;
        }
        return statuses;
    }

    get_default_channel_group = () =>{
        let default_group = {}
        for(let group of this.channel_groups){
            if(group.default){
                default_group = group;
            }
        }
        return default_group;
    }

    setup_scope_mux = async (channels) =>{
        if(this.miscellaneous.scope_mux_address){
            for(let item of channels){
                if(item){
                    let channel_address = parseInt(this.miscellaneous.scope_mux_address) + 4*(parseInt(item.number)+1);
                    await up_peripheral.direct_register_write([[channel_address, parseInt(item.mux_setting)]]);
                }
            }
        }
    }


    change_scope_channel_group = async (group) =>{
        let channels = get_channels_from_group(group, this.channels);
        await this.setup_scope_mux(channels);
        await this.setup_scaling_factors(channels);
        await this.setup_scope_statuses(this.get_channel_statuses(channels));
    };

    setup_scaling_factors = async (channels) =>{
        let sfs = Array(6).fill(1);

        for(let item of channels){
            if(item.scaling_factor){
                sfs[parseInt(item.number)] = parseFloat(item.scaling_factor);
            }
        }

        await set_scaling_factors(sfs);
    }

    setup_scope_statuses = async (statuses) =>{
        await set_channel_status(statuses);
    }

    get_group_by_name = (group_name) =>{
        let group = []
        for(let item of this.channel_groups){
            if(item.group_name === group_name) {
                group = item;
            }
        }
        return group;
    }

    add_channel = async (ch_name) =>{
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_channel_group = async (chg_name) =>{
        let chg = {
            group_name: chg_name,
            group_id: chg_name.replace(/\s/g, "_").toLowerCase(),
            channels:[],
            default:false
        };
        this.channel_groups.push(chg);
        let edit = {application:this.id, item:chg, action:"add", object:"channel_group"};
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_irv = async (irv_address) =>{
        let irv = {
            address:irv_address,
            value:0
        }
        this.initial_registers_values.push(irv);
        let edit = {application:this.id, item:irv, action:"add", object:"irv"};
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_macro = async (macro_name) => {
        let m =  {
            name: macro_name,
            trigger: ""
        };
        this.macro.push(m);
        let edit = {application:this.id, item:m, action:"add", object:"macro"};
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_parameter = async (parameter_name) =>{
        let p = {
            parameter_name: parameter_name,
            parameter_id: parameter_name.replace(/\s/g, "_").toLowerCase(),
            trigger: '',
            value: '0',
            visible: false
        };
        this.parameters.push(p)
        let edit = {application:this.id, item:p, action:"add", object:"parameter"};
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_peripheral = async (name) => {
        let p = {
            name: name,
            peripheral_id: name.replace(/\s/g, "_").toLowerCase(),
            base_address: '0',
            hdl_parameters:{},
            proxied: false,
            proxy_address:'0',
            type: 'Registers',
            spec_id: ""
        };
        let edit = {application:this.id, item:p, action:"add", object:"peripheral"};
        this.peripherals.push(p);
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_filter = async (filter_id) =>{
        let f = {
            id:filter_id,
            filter_name:"",
            peripheral:"",
            enabled:false
        };
        let edit = {application:this.id, item:f, action:"add", object:"filter"};
        this.filters.push(f);
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_selected_script = async (script_id) =>{
        let edit = {application:this.id, item:script_id, action:"add", object:"selected_script"};
        this.scripts.push(script_id);
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_selected_program = async (program_id) =>{
        let edit = {application:this.id, item:program_id, action:"add", object:"selected_program"};
        this.programs.push(program_id);
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_soft_core = async (core_id) => {
        let sc = {
            id: core_id,
            address: 0x0,
            default_program:"",
            io:[]
        }
        let edit = {application:this.id, item:sc, action:"add", object:"soft_core"};
        this.soft_cores.push(sc);
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    set_misc_param = async (param_name) =>{
        let edit = {application:this.id, item: {name:param_name, value:"0"}, action:"add", object:"misc"};
        this.miscellaneous[param_name] = 0;
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    ////////////////////////////////////////////////////

    edit_clock_frequency = async (clock_id, frequency) =>{
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_channel = async (channel_name, field_name, field_value) =>{
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_channel_group = async (chg_name, field_name,field_value) =>{
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_irv = async (address,field_name, field_value) =>{
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_macro = async (macro_name, field_name, field_value) => {

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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_parameters =async (param_id, field_name, field_value) =>{

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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_peripheral = async (periph_name, field_name, field_value) => {

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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_filter = async (filter_id, field_name, field_value) =>{

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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_misc_param = async (param_name, param_value, rename_param) =>{

        let edit = {}
        if(rename_param) {
            edit = {
                application: this.id,
                item: {
                    name: param_name,
                    value: param_value,
                    edit_name: true
                },
                action: "edit",
                object: "misc"
            };
            this.miscellaneous[param_value] = this.miscellaneous[param_name];
            delete this.miscellaneous[param_name];
        }else if(param_name === 'application_name'){
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
            this.application_name = param_value;
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_soft_core =async (core_id, field_name, field_value) =>{
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    ////////////////////////////////////////////////////
    remove_channel = async (ch_id) =>{
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_channel_groups = async (chg_id) =>{
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_irv = async (address) =>{
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_macro = async (macro_name) => {
        this.macro = this.macro.filter(m=>{
            return m.name !== macro_name;
        })

        let edit = {
            application:this.id,
            item:macro_name,
            action:"remove",
            object:"macro"
        };
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_parameter = async (param_id) =>{
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_peripheral = async (periph_id) => {
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_soft_core = async (core_id) => {
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_filter = async (filter_id) => {
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
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_selected_script = async (script_id) => {
        let idx = this.scripts.indexOf(script_id)
        this.scripts.splice(idx,1);

        let edit = {
            application:this.id,
            item:script_id,
            action:"remove",
            object:"selected_script"
        };
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_selected_program = async (program_id) => {
        let idx = this.programs.indexOf(program_id)
        this.programs.splice(idx,1);

        let edit = {
            application:this.id,
            item:program_id,
            action:"remove",
            object:"selected_program"
        };
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_misc_field = async (field_name) =>{
        delete this.miscellaneous[field_name]
        let edit = {
            application:this.id,
            item:field_name,
            action:"remove",
            object:"misc"
        };
        await backend_patch(api_dictionary.applications.edit, edit);
        store.dispatch(updateApplication(this.deep_copy()));
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
