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
    set_scaling_factors,
    up_peripheral,
    up_program
} from "../index.js";
import store from "../../store.js";
import {backend_delete, backend_get, backend_patch, backend_post} from "../proxy/backend.js";
import {api_dictionary} from "../proxy/api_dictionary.js";
import {addApplication, removeApplication, updateApplication} from "#redux/index.js";
import {initialize_scripting_engine, run_script} from "../scripting/script_runner.js";
import {set_scope_address, set_scope_dma_disable} from "../proxy/plot.js";
import type {
    application, clock_frequencies, channel, macro, parameter,
    channel_group, soft_core, filter, peripheral_instance, group_channel_token
} from "#interfaces/index.js";

/// The script a macro or a parameter runs, by its id. Anything else (the string of the older versions) is no script
const resolve_trigger = (trigger: unknown): number | null => typeof trigger === "number" ? trigger : null;

export const empty_channel_group: channel_group = {
    group_name: "",
    group_id: "",
    channels:[],
    default:false
}



export class up_application {
    public id:number;
    public application_name:string;
    public bitstream: string;
    public channels: channel[];
    public channel_groups: channel_group[];
    // the script run when the application is loaded, by its id
    public init_script: number | null;
    public macro: macro[];
    public parameters: parameter[];
    public peripherals: peripheral_instance[];
    public soft_cores: soft_core[];
    public pl_clocks: clock_frequencies;
    public filters: filter[];
    public clock_frequency: number;
    public programs: number[];
    public scripts: number[];
    public miscellaneous: any;
    constructor(app_data_obj: application) {

        this.id = app_data_obj.id;
        this.application_name = app_data_obj.application_name;
        this.bitstream = app_data_obj.bitstream;
        this.channels = app_data_obj.channels;
        this.channel_groups = app_data_obj.channel_groups;
        this.pl_clocks = app_data_obj.pl_clocks;
        this.clock_frequency = app_data_obj.clock_frequency;
        this.init_script = app_data_obj.init_script ?? null;
        this.macro = app_data_obj.macro.map(m => ({...m, trigger: resolve_trigger(m.trigger)}));
        this.parameters = app_data_obj.parameters.map(par => ({...par, trigger: resolve_trigger(par.trigger)}));
        this.peripherals = app_data_obj.peripherals;
        this.soft_cores = app_data_obj.soft_cores;
        this.filters = app_data_obj.filters;
        // copies, the lists are edited in place and the ones of the store are not to be touched
        this.programs = [...app_data_obj.programs];
        this.scripts = [...app_data_obj.scripts];
        this.miscellaneous = app_data_obj.miscellaneous;
    }

    static construct_empty(app_id: number): up_application{
        let app_data_obj: application = {
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
            init_script:null,
            macro:[],
            parameters:[],
            clock_frequency: 100e6,
            peripherals:[],
            soft_cores:[],
            filters:[],
            programs:[],
            scripts:[],
            miscellaneous:{}
        };
        return new up_application(app_data_obj);
    }

    deep_copy = (): up_application =>{
        return new up_application({
            id: this.id,
            application_name:this.application_name,
            bitstream:this.bitstream,
            clock_frequency: this.clock_frequency,
            channels:JSON.parse(JSON.stringify(this.channels)),
            channel_groups:JSON.parse(JSON.stringify(this.channel_groups)),
            pl_clocks:JSON.parse(JSON.stringify(this.pl_clocks)),
            init_script:this.init_script,
            macro:JSON.parse(JSON.stringify(this.macro)),
            parameters:JSON.parse(JSON.stringify(this.parameters)),
            peripherals: JSON.parse(JSON.stringify(this.peripherals)),
            soft_cores: JSON.parse(JSON.stringify(this.soft_cores)),
            filters:JSON.parse(JSON.stringify(this.filters)),
            programs:JSON.parse(JSON.stringify(this.programs)),
            scripts:JSON.parse(JSON.stringify(this.scripts)),
            miscellaneous:JSON.parse(JSON.stringify(this.miscellaneous)),
        });
    }

    static deep_copy_s =  (old_app: application): application => {

        return {
            id: old_app.id,
            application_name:old_app.name,
            bitstream:old_app.bitstream,
            clock_frequency: old_app.clock_frequency,
            channels:JSON.parse(JSON.stringify(old_app.channels)),
            channel_groups:JSON.parse(JSON.stringify(old_app.channel_groups)),
            pl_clocks:JSON.parse(JSON.stringify(old_app.pl_clocks)),
            init_script:old_app.init_script,
            macro:JSON.parse(JSON.stringify(old_app.macro)),
            parameters:JSON.parse(JSON.stringify(old_app.parameters)),
            peripherals:JSON.parse(JSON.stringify(old_app.peripherals)),
            soft_cores:JSON.parse(JSON.stringify(old_app.soft_cores)),
            filters:JSON.parse(JSON.stringify(old_app.filters)),
            programs:JSON.parse(JSON.stringify(old_app.programs)),
            scripts:JSON.parse(JSON.stringify(old_app.scripts)),
            miscellaneous:JSON.parse(JSON.stringify(old_app.miscellaneous))
        };

    }

    static duplicate = async (old_app: application, new_id: number) => {
        let new_app = up_application.deep_copy_s(old_app);
        new_app.id = new_id;
        new_app.name = old_app.name + "_copy_" + new_id;
        return new up_application(new_app);
    }


    add_remote = () => {
        store.dispatch(addApplication({[this.id]:this}))
        return backend_post(api_dictionary.applications.add + '/'+ this.id, this._get_app());
    }

    set_active = async () => {
        await set_scope_dma_disable(true);
        try {
            await backend_get(api_dictionary.operations.load_application + '/' + this.id);
        } catch (e) {
         throw e;
        }
        for(let i in this.pl_clocks){
            await this.set_global_clock_frequency(parseInt(i), this.pl_clocks[i]);
        }
        await this.run_init_script();
        await this.setup_scope();
        return this.load_soft_cores();
    }

    setup_scope = async () =>{

        let [channels, group] = this.get_scope_setup_info();
        await this.setup_scope_mux(channels);
        await this.setup_scaling_factors(channels);
        await set_scope_address({address:parseInt(this.miscellaneous.scope_mux_address), dma_buffer_offset:0x208})
        await set_scope_address({address:parseInt(this.miscellaneous.scope_mux_address), dma_buffer_offset:0x208})

    }

    get_parameters_map = () =>{
        let map:{
            [index: string]: number;
        } = {}
        for(const p of this.parameters){
            map[p.parameter_id] = p.value;
        }
        return map;
    }

    /// Runs the init script, at the point where the application is loaded on the hardware (the clocks are set, the scope
    /// and the cores are not): the writes of the script are sent in one batch
    run_init_script = async () =>{
        if(this.init_script === null) return;
        // the engine is initialized for the application chosen once this is done, the script needs it now
        initialize_scripting_engine(this, store.getState().peripherals);
        const writes = run_script(this.init_script, this.get_parameters_map(), "", null);
        if(writes.length !== 0){
            await up_peripheral.bulk_register_write(writes);
        }
    }

    load_soft_cores = async () =>{
        let error_cores = [];
        for (let core of this.soft_cores){
            let result = await this.load_core(core, null);
            if(result[0].status !=="passed"){
                error_cores.push(core.id)
            }
        }
        return error_cores;
    }

    set_global_clock_frequency = async (clock_n: number, frequency: number) =>{
        return backend_post(api_dictionary.operations.clock,
            {
                type:"global",
                id: clock_n,
                value: frequency,
                is_primary:true
            }
        )
    }

    get_global_clock_frequency = async (clock_n: number) =>{
        try{
            let clocks = await backend_get<Record<number, number>>(api_dictionary.operations.clock);
            return clocks[clock_n];
        } catch (e) {
            console.error(e);
            return 0;
        }

    }

    /// Loads a program on a core: the given one, or the default program of the core when there is none
    load_core = (core: any, program: any | null) =>{

        let selected_program;
        if(program){
            selected_program = new up_program(program);
        } else {
            let programs = store.getState().programs;
            let program_obj = Object.values(programs).filter((p) => {
                return p.name === core.default_program;
            })[0];
            if(!program_obj)return [{status:"failed", message:"Program not found"}];
            selected_program = new up_program(program_obj)

        }
        return selected_program.load(core);
    }

    get_scope_setup_info = ():[channel[], channel_group | undefined] =>{
        let channels_list: channel[] = [];
        let default_group: channel_group | undefined = undefined;
        for(let group of this.channel_groups){
            if(group.default){
                default_group = group;
                channels_list = get_channels_from_group(group, this.channels);
            }
        }
        return [channels_list, default_group]
    }

    get_default_channel_group = () : channel_group | undefined =>{

        for(let group of this.channel_groups){
            if(group.default){
                return group;
            }
        }
        return undefined;
    }

    setup_scope_mux = async (channels: channel[]) =>{
        if(this.miscellaneous.scope_mux_address){
            for(let item of channels){
                if(item){
                    let channel_address = Math.round(parseInt(this.miscellaneous.scope_mux_address) + 4*(item.number+1));
                    try {
                        await up_peripheral.direct_register_write([[channel_address, Number(item.mux_setting)]]);
                    } catch (e) {
                        let i = 0;
                    }

                }
            }
        }
    }


    change_scope_channel_group = async (group: channel_group) =>{
        let channels = get_channels_from_group(group, this.channels);
        await this.setup_scope_mux(channels);
        await this.setup_scaling_factors(channels);
    };

    setup_scaling_factors = async (channels: channel[]) =>{
        let sfs = Array(6).fill(1);

        for(let item of channels){
            if(item.scaling_factor){
                sfs[item.number] = Number(item.scaling_factor);
            }
        }

        await set_scaling_factors(sfs);
    }

    get_group_by_name = (group_name:string) =>{
        let group;
        for(let item of this.channel_groups){
            if(item.group_name === group_name) {
                group = item;
            }
        }
        return group;
    }

    add_channel = async (id: number) =>{
        let ch_name = "new_channel_" + id.toString();
        let ch: channel = {
            name: ch_name,
            id: ch_name.replace(/\s/g, "_").toLowerCase(),
            number: 0,
            mux_setting: 0,
            enabled: false,
            scaling_factor:1
        };
        this.channels.push(ch);
        let edit = {
            application:this.id,
            item:ch,
            action:"add",
            object:"channel"
        };
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_channel_group = async (id:number) =>{
        let chg_name = "new_group_" + id.toString();
        let chg: channel_group = {
            group_name: chg_name,
            group_id: chg_name.replace(/\s/g, "_").toLowerCase(),
            channels:[],
            // the scope opens with the default group, which there has to be one of
            default:this.channel_groups.length === 0
        };
        this.channel_groups.push(chg);
        let edit = {application:this.id, item:chg, action:"add", object:"channel_group"};
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_macro = async (id:number) => {
        let macro_name = "new_macro_" + id.toString();
        let m: macro =  {
            name: macro_name,
            trigger: null
        };
        this.macro.push(m);
        let edit = {application:this.id, item:m, action:"add", object:"macro"};
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_parameter = async (id:number) =>{
        let parameter_name = "new_parameter_" + id.toString();
        let p: parameter = {
            parameter_name: parameter_name,
            parameter_id: parameter_name.replace(/\s/g, "_").toLowerCase(),
            trigger: null,
            value: 0,
            visible: false
        };
        this.parameters.push(p)
        let edit = {application:this.id, item:p, action:"add", object:"parameter"};
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_peripheral = async (id:number) => {
        let name = "new_peripheral_" + id.toString();
        let p: peripheral_instance = {
            name: name,
            peripheral_id: name.replace(/\s/g, "_").toLowerCase(),
            base_address: "0",
            hdl_parameters:{},
            proxied: false,
            proxy_address: "0",
            proxy_type: "",
            type: 'Registers',
            spec_id: ""
        };
        let edit = {application:this.id, item:p, action:"add", object:"peripheral"};
        this.peripherals.push(p);
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_filter = async (filter_id:number) =>{
        let f: filter = {
            id:filter_id,
            filter_name:"",
            peripheral:"",
            enabled:false
        };
        let edit = {application:this.id, item:f, action:"add", object:"filter"};
        this.filters.push(f);
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_selected_script = async (script_id: number) =>{
        if(Number.isNaN(script_id) || this.scripts.some(s => Number(s) === script_id)) return;
        let edit = {application:this.id, item:script_id, action:"add", object:"selected_script"};
        this.scripts.push(script_id);
        try{
            await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        } catch (e) {
            this.scripts.splice(this.scripts.lastIndexOf(script_id), 1);
            throw e;
        }
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_selected_program = async (program_id: number) =>{
        if(Number.isNaN(program_id) || this.programs.some(p => Number(p) === program_id)) return;
        let edit = {application:this.id, item:program_id, action:"add", object:"selected_program"};
        this.programs.push(program_id);
        try{
            await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        } catch (e) {
            this.programs.splice(this.programs.indexOf(program_id), 1);
            throw e;
        }
        store.dispatch(updateApplication(this.deep_copy()));
    }

    add_soft_core = async (id: number) => {
        let core_id = "new_core_" + id.toString();
        let sc = {
            id: core_id,
            address: 0x0,
            default_program:"",
            io:[]
        }
        let edit = {application:this.id, item:sc, action:"add", object:"soft_core"};
        this.soft_cores.push(sc);
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    set_misc_param = async (id: number) =>{
        let param_name = "new_parameter_" + id.toString();
        let edit = {application:this.id, item: {name:param_name, value:"0"}, action:"add", object:"misc"};
        this.miscellaneous[param_name] = 0;
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    ////////////////////////////////////////////////////

    edit_clock_frequency = async (clock_id: number, frequency: number) =>{
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
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_channel = async (channel_name: string, field_name:string, field_value:any) =>{
        let [channel] = this.channels.filter((ch) =>{
            return ch.name === channel_name;
        });
        (channel as any)[field_name] = field_value;
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
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_channel_group = async (chg_name: string, field_name:string,field_value:any) =>{
        let [group] = this.channel_groups.filter((chg) =>{
            return chg.group_name === chg_name;
        });

        (group as any)[field_name] = field_value;
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
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    /// Only one group is the default one: the others are not
    set_default_channel_group = async (chg_name: string) =>{
        for(const group of [...this.channel_groups]){
            const is_default = group.group_name === chg_name;
            if(group.default !== is_default){
                await this.edit_channel_group(group.group_name, "default", is_default);
            }
        }
    }

    set_init_script = async (script_id: number | null) =>{
        this.init_script = script_id;
        let edit = {
            application:this.id,
            item:{
                name:"init_script",
                value:script_id,
                edit_name:false
            },
            action:"edit",
            object:"misc"
        };
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_macro = async (macro_name: string, field_name:string, field_value:any) => {

        let [macro] = this.macro.filter((m) =>{
            return m.name === macro_name;
        });
        (macro as any)[field_name] = field_value;

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
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_parameters =async (param_id: string, field_name:string, field_value:any) =>{

        let [param] = this.parameters.filter((p) =>{
            return p.parameter_id === param_id;
        });
        (param as any)[field_name] = field_value;
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
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_peripheral = async (periph_name: string, field_name: string, field_value: any) => {
        if((field_name === "name" || field_name === "peripheral_id") && typeof field_value === "string"){
            // a dot separates the peripheral from the register in the terminal and in the scripts
            field_value = field_value.replace(/\./g, "_");
        }

        let [periph] = this.peripherals.filter((p) =>{
            return p.name === periph_name;
        });
        (periph as any)[field_name] = field_value;

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
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_filter = async (filter_id:  number, field_name:string, field_value: any) =>{

        let [filter] = this.filters.filter((f) =>{
            return f.id === filter_id;
        });
        (filter as any)[field_name] = field_value;
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
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_misc_param = async (param_name: string, param_value: string, rename_param: boolean) =>{

        let edit;
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
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    edit_soft_core =async (core_id: string, field_name: string, field_value: any) =>{
        let [core] = this.soft_cores.filter((sc) =>{
            return sc.id === core_id;
        });
        (core as any)[field_name] = field_value;
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
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    ////////////////////////////////////////////////////
    remove_channel = async (ch_name: string) =>{
        let idx = this.channels.findIndex((ch) =>{
            return ch.name === ch_name;
        })
        if(idx >= 0) this.channels.splice(idx,1);

        let edit = {
            application:this.id,
            item:ch_name,
            action:"remove",
            object:"channel"
        };
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_channel_groups = async (chg_name: string) =>{
        let idx = this.channel_groups.findIndex((chg) =>{
            return chg.group_name === chg_name;
        })
        if(idx >= 0) this.channel_groups.splice(idx,1);

        let edit = {
            application:this.id,
            item:chg_name,
            action:"remove",
            object:"channel_group"
        };
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_macro = async (macro_name: string) => {
        let idx  = this.macro.findIndex(m=>{
            return m.name === macro_name;
        })
        if(idx >= 0) this.macro.splice(idx,1);

        let edit = {
            application:this.id,
            item:macro_name,
            action:"remove",
            object:"macro"
        };
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_parameter = async (param_id: string) =>{
        let idx = this.parameters.findIndex((p) =>{
            return p.parameter_id === param_id;
        })
        if(idx >= 0) this.parameters.splice(idx,1);

        let edit = {
            application:this.id,
            item:param_id,
            action:"remove",
            object:"parameter"
        };
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_peripheral = async (periph_name: string) => {
        let idx = this.peripherals.findIndex((p) =>{
            return p.name === periph_name;
        })
        if(idx >= 0) this.peripherals.splice(idx,1);

        let edit = {
            application:this.id,
            item:periph_name,
            action:"remove",
            object:"peripheral"
        };
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_soft_core = async (core_id: string) => {
        let idx = this.soft_cores.findIndex((sc) =>{
            return sc.id === core_id;
        })
        if(idx >= 0) this.soft_cores.splice(idx,1);

        let edit = {
            application:this.id,
            item:core_id,
            action:"remove",
            object:"soft_core"
        };
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_filter = async (filter_id: number) => {
        let idx = this.filters.findIndex((f) =>{
            return f.id === filter_id;
        })
        if(idx >= 0) this.filters.splice(idx,1);

        let edit = {
            application:this.id,
            item:filter_id,
            action:"remove",
            object:"filter"
        };
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_selected_script = async (script_id: number) => {
        let idx = this.scripts.findIndex(s => Number(s) === script_id);
        if(idx < 0) return;
        this.scripts.splice(idx,1);
        // the script is not part of the application any more
        const init_script_was = this.init_script;
        if(this.init_script === script_id) this.init_script = null;

        let edit = {
            application:this.id,
            // the server keeps these ids in a text column and removes with a strict comparison
            item:String(script_id),
            action:"remove",
            object:"selected_script"
        };
        try{
            await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        } catch (e) {
            this.scripts.splice(idx, 0, script_id);
            this.init_script = init_script_was;
            throw e;
        }
        store.dispatch(updateApplication(this.deep_copy()));
        // the script is gone either way, a failure here must not undo the removal
        if(init_script_was !== this.init_script){
            try{
                await this.set_init_script(null);
            } catch (e) {
                console.error(e);
            }
        }
    }

    remove_selected_program = async (program_id: number) => {
        let idx = this.programs.findIndex(p => Number(p) === program_id);
        if(idx < 0) return;
        this.programs.splice(idx,1);

        let edit = {
            application:this.id,
            // the server keeps these ids in a text column and removes with a strict comparison
            item:String(program_id),
            action:"remove",
            object:"selected_program"
        };
        try{
            await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        } catch (e) {
            this.programs.splice(idx, 0, program_id);
            throw e;
        }
        store.dispatch(updateApplication(this.deep_copy()));
    }

    remove_misc_field = async (field_name: string) =>{
        delete this.miscellaneous[field_name]
        let edit = {
            application:this.id,
            item:field_name,
            action:"remove",
            object:"misc"
        };
        await backend_patch(api_dictionary.applications.edit + '/' + this.id, edit);
        store.dispatch(updateApplication(this.deep_copy()));
    }

    static async delete(app: up_application) {
        await backend_delete(api_dictionary.applications.remove + '/' + app.id);
        store.dispatch(removeApplication(app.id));
    }

    get_raw_obj = () => {
        return this._get_app();
    }

    _get_app = () =>{
        return {
            id:this.id,
            application_name:this.application_name,
            bitstream:this.bitstream,
            channels:this.channels,
            channel_groups:this.channel_groups,
            pl_clocks:this.pl_clocks,
            init_script:this.init_script,
            macro:this.macro,
            parameters:this.parameters,
            peripherals:this.peripherals,
            soft_cores:this.soft_cores,
            filters:this.filters,
            scripts:this.scripts,
            programs:this.programs,
            miscellaneous:this.miscellaneous
        };
    }
}
