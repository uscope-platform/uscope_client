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

import {saveParameter} from "@redux";
import {up_peripheral} from "@client_core";
import {parseFunction} from "./frontend";
import {translate_legacy_registers, translate_registers} from "./backend";
import {set_write_callback} from "@client_core";
import {__selected_application} from "../index";

export let scripting_engine_peripherals = {}
export let script_register_access_log = [];


let script_workspace = {};

export const initialize_scripting_engine = (application, peripherals) =>{
    //TODO: This call is kind of redundant, this work should be done in the data_model
    let applications_peripherals = application.peripherals;
    set_write_callback(register_write_callback);
    for (const p of applications_peripherals) {
        if(p.spec_id!==""){
            let p_obj = Object.values(peripherals).filter((val)=>{
                return val.id === parseInt(p.spec_id);
            })[0];
            let periph = new up_peripheral(p_obj);
            scripting_engine_peripherals[p.peripheral_id] = {regs:periph.get_proxied_registers(p.peripheral_id, p.hdl_parameters), periph_obj:p, spec_obj:periph._get_periph()[periph.name]};
        }
    }
}


export const run_script = (store, trigger_string, parameters, current_parameter, argument) =>{
    const state = store.getState();
    const scripts = state.scripts;


    let trigger = Object.values(scripts).filter((script)=>{
        return script.triggers.includes(trigger_string);
    });
    let content = trigger[0].content;

    let context =  {registers: {}, parameters: parameters};
    context["workspace"] = script_workspace;
    let first_arg = argument;

    let script_content =  parseFunction(content);
    if(!script_content){
        return {}
    }
    script_register_access_log = [];
    let peripherals = purge_peripherals(scripting_engine_peripherals);
    let {workspace, registers} = script_content.call(peripherals, first_arg, context);

    let bulk_registers = [];
    if(registers!== null) {
        let regs = translate_legacy_registers(store, registers);
        bulk_registers.push(...regs);
    }

    if(script_register_access_log.length !== 0) {
        bulk_registers.push(...translate_registers(script_register_access_log, scripting_engine_peripherals));
    }

    if(workspace!== null){
        script_workspace = {...script_workspace, ...workspace};
    }
    return bulk_registers;
};

export const run_parameter_script = (store, parameter) => {

    let parameters = __selected_application.parameters;

    let floatValue = parseFloat(parameter.value);
    let objIndex = parameters.findIndex((obj => obj.parameter_id === parameter.name));

    let params_map = {};
    for(const i of parameters){
        params_map[i.parameter_id] = i.value;
    }


    if(parameter.value!=="" && parameters[objIndex].value !==floatValue){
        // run parameter script

        let bulk_registers = run_script(store, parameters[objIndex].trigger, params_map,  parameter.name, floatValue);

        //update value of parameter in redux
        store.dispatch(saveParameter({name:parameter.name, value:floatValue, app:__selected_application.id}))

        if(bulk_registers !== null && bulk_registers.length !== 0){
            return up_peripheral.bulk_register_write(bulk_registers).then();
        } else {
            return new Promise((resolve, reject) =>{
                resolve();
            });
        }
    } else {
        return new Promise((resolve, reject) =>{
            resolve();
        });
    }
};

const register_write_callback = (periph_id, spec_id, reg_id, field_spec, field_name, access_type)=>{
    script_register_access_log.push({periph_id:periph_id, spec_id:spec_id, reg_id:reg_id, access_type:access_type, field_spec:field_spec, field_name:field_name});
};

const purge_peripherals = (p) =>{
    let purged = {}
    for (const key in p) {
        purged[key] = p[key].regs
    }
    return purged
}