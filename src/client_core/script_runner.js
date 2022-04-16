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

import {saveScriptsWorkspace} from "../redux/Actions/scriptsActions";
import {context_cleaner, parseFunction} from "../user_script_launcher";
import {saveParameter} from "../redux/Actions/applicationActions";


const translate_registers = (store, registers) => {
    const state = store.getState();
    const app_peripherals = state.applications[state.settings['application']]['peripherals'];
    const peripherals_specs = state.peripherals;


    let bulk_registers = [];
    for(let reg in registers){
        let [periph_id, reg_id] = reg.split('.');
        let periph = app_peripherals.filter((periph)=>{
            return periph.peripheral_id === periph_id;
        })[0];
        let reg_offset = peripherals_specs[periph.spec_id].registers.filter((reg)=>{
            return reg.ID === reg_id;
        })[0].offset;
        if(periph.proxied){
            if(periph.proxy_type==='rtcu'){
                let address = parseInt(periph.base_address)+parseInt(reg_offset);
                bulk_registers.push({address:parseInt(periph.proxy_address), value:registers[reg]});
                bulk_registers.push({address:parseInt(periph.proxy_address)+4, value:address});

            } else if(periph.proxy_type === 'axis_const'){
                let address = parseInt(periph.base_address)+parseInt(reg_offset);
                bulk_registers.push({address:parseInt(periph.proxy_address)+4, value:address});
                bulk_registers.push({address:parseInt(periph.proxy_address), value:registers[reg]});
            }
        } else{
            let address = parseInt(periph.base_address)+parseInt(reg_offset);
            bulk_registers.push({address:address, value:registers[reg]})
        }

    }

    return bulk_registers;
};

export const run_script = (store, trigger_string, parameters, current_parameter) =>{
    const state = store.getState();
    const scripts = state.scripts;
    const old_registers = state.registerValues;


    let trigger = Object.values(scripts).filter((script)=>{
        return script.triggers.includes(trigger_string);
    });
    let content = trigger[0].script_content;

    let context = context_cleaner(old_registers, parameters, current_parameter);
    context["workspace"] = state.scriptsWorkspace;

    let {workspace, registers} = parseFunction(content)(null, context);

    let bulk_registers = {};
    if(registers!== null) {
        bulk_registers = translate_registers(store, registers);
    }

    if(workspace!== null){
        store.dispatch(saveScriptsWorkspace(workspace))
    }
    return bulk_registers;
};

export const run_parameter_script = (store, parameter) => {
    const state = store.getState();
    const settings = state.settings;
    let parameters = state.applications[state.settings['application']].parameters;

    let floatValue = parseFloat(parameter.value);
    let objIndex = parameters.findIndex((obj => obj.parameter_id === parameter.name));
    if(parameter.value!=="" && parameters[objIndex].value !==floatValue){
        //Retrive relevant script content

        let bulk_registers = run_script(store, parameters[objIndex].trigger, parameters,  parameter.name);
        if(bulk_registers !== null){
            settings.server.periph_proxy.bulkRegisterWrite({payload:bulk_registers});
        }

        store.dispatch(saveParameter({name:parameter.name, value:floatValue, app:settings["application"]}))
    }
};