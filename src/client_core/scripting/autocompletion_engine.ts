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

import {scripting_engine_peripherals} from "./script_runner.js";
import {up_peripheral} from "../data_models/up_peripheral.js";
import {up_register} from "../data_models/up_register.js";
import type {autocomplete_suggestion, autocompletion_context} from "#interfaces/scripting/types.js";

export const autocompletion_engine = (line: autocompletion_context, explicit: boolean) : autocomplete_suggestion[] => {

    if (line.from === line.to && !explicit)
        return []
    if(line.text.includes("this.")){
        let path = line.text.split(".")
        if (path.length ===2){
            return autocomplete_peripheral_name(path);
        } else if (path.length ===3){
            return autocomplete_register_name(path);
        } else if (path.length ===4) {
            return autocomplete_field_name(path);
        }
        return [];
    } else{
        if("this".startsWith(line.text))
            return [{label: "this", type: "keyword"}];
    }
    return [];
}

export const prefix_extractor = (args: autocomplete_suggestion[] ) => {

    if(args.length > 1) {
        let pref_arr = args.map(arg => arg.label);
        return prefix(pref_arr);
    }
    return null
}

let autocomplete_peripheral_name = (path: string[]): autocomplete_suggestion[]  =>{
    
    if(path.length < 2) return [];
    let potential_name = path[1];
    if(potential_name === undefined) return [];
    let matches = Object.keys(scripting_engine_peripherals).filter((item)=>{
        return item.startsWith(potential_name);
    })

    return matches.map((item) => {
        return {label: item, type: "keyword"};
    });
};

let autocomplete_register_name = (path: string[]): autocomplete_suggestion[]  =>{

    if(path.length <3) return [];
    let peripheral = path[1];
    if(peripheral === undefined) return [];
    let peripheral_obj = scripting_engine_peripherals[peripheral];
    if(peripheral_obj === undefined) return [];
    let reg_name = path[2];
    if(reg_name === undefined) return [];

    let parameters = peripheral_obj.periph_obj.hdl_parameters;
    let periph = new up_peripheral(peripheral_obj.spec_obj);
    let registers = periph.get_register_names(parameters);
    let matches = registers.flat(1).filter((item) => {
        return item.startsWith(reg_name);
    });
    return matches.map((item) => {
        return {label: item, type: "keyword"};
    });
};

let autocomplete_field_name = (path: string[]): autocomplete_suggestion[]  =>{

    if(path.length <4) return [];
    let peripheral = path[1];
    if(peripheral === undefined) return [];
    let peripheral_obj = scripting_engine_peripherals[peripheral];
    if(peripheral_obj === undefined) return [];
    let reg_name = path[2];
    if(reg_name === undefined) return [];
    let field_name = path[3];
    if(field_name === undefined) return [];


    let parameters = peripheral_obj.periph_obj.hdl_parameters;
    let fields = [];
    peripheral_obj.spec_obj.registers.map((reg) =>{
        if(reg.ID === path[2]){
            let register = new up_register(reg, 9999);
            let field_names = register.get_field_names(parameters);
            fields = field_names.flat(1).filter((item) => {
                return item.startsWith(field_name);
            });
        }

    });
    fields.push("value");
    return fields.map((item) => {
        return {label: item, type: "keyword"};
    });
};

export const prefix = (words:string[]) => {
    let first_word = words[0];
    if (!first_word || words.length ===  1) return first_word || "";
    let i = 0;
    while(first_word[i] && words.every(w => w[i] === first_word[i]))
        i++;

    return first_word.substring(0, i);
}

