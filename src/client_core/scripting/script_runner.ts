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

import store from "../../store.js";
import {saveParameter} from "#redux/index.js";
import {up_peripheral, set_write_callback, up_application} from "#client_core/index.js";
import {parseFunction} from "./frontend.js";
import {translate_registers} from "./backend.js";
import {__selected_application} from "../index.js";
import type {peripheral, autocomplete_periph_object, register_write_object, register_write} from "#interfaces/index.js";
import type {fields_object} from "#client_core/data_models/register_proxy.js";

export let scripting_engine_peripherals : Record<string, autocomplete_periph_object> = {}
export let script_register_access_log: register_write_object[] = [];


let script_workspace = {};

export const initialize_scripting_engine = (application: up_application | null , peripherals: peripheral[]) =>{
    //TODO: This call is kind of redundant, this work should be done in the data_model
    if(application === null) return;
    let applications_peripherals = application.peripherals;
    set_write_callback(register_write_callback);
    for (const p of applications_peripherals) {
        if(p.spec_id!==""){
            let p_obj = Object.values(peripherals).filter((val)=>{
                return val.id === parseInt(p.spec_id);
            })[0];
            if(p_obj === undefined) continue;
            let periph = new up_peripheral(p_obj);
            scripting_engine_peripherals[p.peripheral_id] = {regs:periph.get_proxied_registers(p.peripheral_id, p.hdl_parameters), periph_obj:p, spec_obj:periph._get_periph()[periph.name]!};
        }
    }
}


export const run_script = (
    trigger_string: string, parameters: Record<string, number>, current_parameter: string, argument: number
) : register_write[]  =>{
    const scripts = store.getState().scripts;


    let trigger = Object.values(scripts).filter((script)=>{
        return script.triggers === trigger_string;
    });
    if(trigger.length === 0)return [];
    let content = trigger[0].content;

    let context =  {registers: {}, parameters: parameters, workspace: script_workspace};

    let first_arg = argument;

    let script_content =  parseFunction(content);
    if(!script_content){
        return []
    }
    script_register_access_log = [];
    let peripherals = purge_peripherals();
    let {workspace, registers} = script_content.call(peripherals, first_arg, context);

    let bulk_registers: register_write[]  = [];
    if(script_register_access_log.length !== 0) {
        bulk_registers.push(...translate_registers(script_register_access_log, scripting_engine_peripherals));
    }

    if(workspace!== null){
        script_workspace = {...script_workspace, ...workspace};
    }
    return bulk_registers;
};

export const run_parameter_script = ( param_name: string, param_value: string) => {

    let parameters = __selected_application.parameters;

    let floatValue = parseFloat(param_value);
    let objIndex = parameters.findIndex((obj => obj.parameter_id === param_name));

    let params_map: Record<string, number> = {};
    for(const i of parameters){
        if(typeof i.value === "string") continue;
        params_map[i.parameter_id] = i.value;
    }

    let p = parameters[objIndex]
    if(p === undefined) return;

    if(param_value!=="" && p.value !==floatValue){
        // run parameter script

        let bulk_registers = run_script( p.trigger, params_map,  param_name, floatValue);

        //update value of parameter in redux
        store.dispatch(saveParameter({name:param_name, value:floatValue, app:__selected_application.id}))

        if(bulk_registers !== null && bulk_registers.length !== 0){
            return up_peripheral.bulk_register_write(bulk_registers).then();
        } else {
            return new Promise((resolve, reject) =>{
                resolve("");
            });
        }
    } else {
        return new Promise((resolve, reject) =>{
            resolve("");
        });
    }
};

const register_write_callback = (
    periph_id: string, spec_id: number, reg_id: string, field_spec: { length: number; offset: number } | undefined, prop:string, access_type: string
)=>{
    script_register_access_log.push({
        periph_id:periph_id,
        spec_id:spec_id,
        reg_id:reg_id,
        access_type:access_type,
        field_spec:field_spec,
        field_name:prop
    });
};

const purge_peripherals = () =>{
    let purged:Record<string, Record<string, fields_object>> = {}
    for (const key in scripting_engine_peripherals) {
        purged[key] = scripting_engine_peripherals[key]!.regs
    }
    return purged
}