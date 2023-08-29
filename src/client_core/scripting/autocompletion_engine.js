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

import {scripting_engine_peripherals} from "./script_runner";
import {up_peripheral} from "../data_models/up_peripheral";
import {up_register} from "../data_models/up_register";

export const autocompletion_engine = (line, explicit) => {

    if (line.from === line.to && !explicit)
        return null
    if(line.text.includes("this.")){
        let path = line.text.split(".")
        if (path.length ===2){
            return autocomplete_peripheral_name(path);
        } else if (path.length ===3){
            return autocomplete_register_name(path);
        } else if (path.length ===4) {
            return autocomplete_field_name(path);
        }
        return null;
    } else{
        if("this".startsWith(line.text))
            return [{label: "this", type: "keyword"}];
    }

}

let autocomplete_peripheral_name = (path) =>{
    let matches = Object.keys(scripting_engine_peripherals).filter((item)=>{
        return item.startsWith(path[1]);
    })

    return matches.map((item) => {
        return {label: item, type: "keyword"};
    });
};

let autocomplete_register_name = (path) =>{
    let parameters = scripting_engine_peripherals[path[1]].periph_obj.hdl_parameters;
    let periph = new up_peripheral(scripting_engine_peripherals[path[1]].spec_obj);
    let registers = periph.get_register_names(parameters);

    let matches = registers.flat(1).filter((item) => {
        return item.startsWith(path[2]);
    });
    return matches.map((item) => {
        return {label: item, type: "keyword"};
    });
};

let autocomplete_field_name = (path) =>{
    let parametric = scripting_engine_peripherals[path[1]].spec_obj.parametric;
    let parameters = scripting_engine_peripherals[path[1]].periph_obj.hdl_parameters;
    let fields = [];
    scripting_engine_peripherals[path[1]].spec_obj.registers.map((reg) =>{
        if(reg.ID === path[2]){
            let register = new up_register(reg, "", parametric);
            let field_names = register.get_field_names(parameters);
            fields = field_names.flat(1).filter((item) => {
                return item.startsWith(path[3]);
            });
        }

    });
    fields.push("value");
    return fields.map((item) => {
        return {label: item, type: "keyword"};
    });
};