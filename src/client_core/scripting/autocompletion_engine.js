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

export const autocompletion_engine = (line, explicit) => {

    if (line.from === line.to && !explicit)
        return null
    if(line.text.includes("this.")){
        let path = line.text.split(".")
        if (path.length ===2){
            let matches = Object.keys(scripting_engine_peripherals).filter((item)=>{
                return item.startsWith(path[1]);
            })

            return matches.map((item) => {
                return {label: item, type: "keyword"};
            });
        } else if (path.length ===3){
            let periph = scripting_engine_peripherals[path[1]].regs
            let matches = Object.keys(periph).filter((item) => {
                return item.startsWith(path[2]);
            });
            return matches.map((item) => {
                return {label: item, type: "keyword"};
            });
        } else if (path.length ===4) {
            let periph = scripting_engine_peripherals[path[1]].regs
            let reg = Object.keys(periph[path[2]]);
            reg = reg.filter((item)=>{
                return ![
                    "field_specs","peripheral_id", "peripheral_spec_id", "register_id"
                ].includes(item);
            })
            let fields = reg.map((item) => {
                    return {label: item, type: "keyword"};
            });
            fields.push({label: "value", type: "keyword"})
            return fields;
        }
        return null;
    } else{
        if("this".startsWith(line.text))
            return [{label: "this", type: "keyword"}];
    }

}