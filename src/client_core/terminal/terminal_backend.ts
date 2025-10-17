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

import {script_register_access_log, scripting_engine_peripherals} from "../scripting/script_runner.js";
import {translate_registers} from "../scripting/backend.js";
import {up_peripheral} from "#client_core/index.js";
import {__selected_application, up_program} from "../index.js";
import {get_version} from "../proxy/platform.js";

import store from "../../store.js";
import type {program} from "#interfaces/index.js";

declare const __USCOPE_CLIENT_VERSION__: string;
type TerminalCommand = (args: string[]) => Promise<string[]>;

export const terminal_backend : Record<string, TerminalCommand> = {
    write: (args: string[]): Promise<string[]> =>{
        if(args[0] === "--help"){
            return new Promise((resolve)=>{
                resolve([
                    "WRITE:",
                    "This command adds a write request to the queue for batch execution",
                    "NOTE: When accessing single fields the whole register gets written anyway",
                    "the default value for non accessed fields is 0",
                    "format: write [REGISTER/FIELD] [VALUE]"
                ]);
            })
        }
        let register = args[0];
        let value = args[1];
        if(!register || !value) return new Promise((resolve, reject)=>{
            reject(["ERROR: Missing register or value"]);
        })
        translate_specifier(register,value);
        return new Promise((resolve)=>{
          resolve([])
        })
    },
    write_direct:(args: string[]): Promise<string[]> =>{
        if(args[0] === "--help"){
            return new Promise((resolve)=>{
                resolve([
                    "WRITE DIRECT:",
                    "This command immediately writes to the specified register",
                    "NOTE: This command can only write full registers",
                    "format: write_direct [REGISTER] [VALUE]"
                ]);
            })
        }
        let register = args[0];
        let value = args[1];
        if(!register || !value) return new Promise((resolve, reject)=>{
            reject(["ERROR: Missing register or value"]);
        })
        translate_specifier(register,value);
        let writes = translate_registers(script_register_access_log, scripting_engine_peripherals);
        script_register_access_log.length = 0;
        up_peripheral.bulk_register_write(writes).then();
        return new Promise((resolve)=>{
            resolve([])
        })
    },
    clear_queue:(args: string[]): Promise<string[]> =>{
        if(args[0] === "--help"){
            return new Promise((resolve)=>{
                resolve([
                    "CLEAR QUEUE:",
                    "This command clears the write command queue",
                    "format: clear_queue"
                ]);
            })
        }
        script_register_access_log.length = 0;
        return new Promise((resolve)=>{
            resolve([])
        })
    },
    execute_queue:(args: string[]): Promise<string[]> =>{
        if(args[0] === "--help"){
            return new Promise((resolve)=>{
                resolve([
                    "EXECUTE QUEUE:",
                    "This command executes the write command queue",
                    "format: execute_queue"
                ]);
            })
        }

        let writes = translate_registers(script_register_access_log, scripting_engine_peripherals);
        script_register_access_log.length = 0;
        up_peripheral.bulk_register_write(writes).then();
        return new Promise((resolve)=>{
            resolve([])
        })
    },
    read:(args: string[]): Promise<string[]> =>{
        if(args[0] === "--help"){
            return new Promise((resolve)=>{
                resolve([
                    "READ:",
                    "This command reads the value of the specified register",
                    "format: read [REGISTER]"
                ]);
            })
        }
        let specifier = args[0];
        if(!specifier) return new Promise((resolve, reject)=>{
            reject(["ERROR: Missing register specifier"]);
        })
        // PERFORM A DUMMY WRITE TO OBTAIN THE CORRECT ADDRESS
        translate_specifier(specifier,"0");
        let access = translate_registers(script_register_access_log, scripting_engine_peripherals)[0];
        if(!access)
            return new Promise((resolve, reject)=>{
                reject(["ERROR: Invalid register"]);
            })
        script_register_access_log.length = 0;
        return up_peripheral.direct_register_read(access.address).then((response)=>{
            return [response.response];
        });
    },

    version:(args: string[]): Promise<string[]>=>{
        if(args[0] === "--help"){
            return new Promise((resolve)=>{
                resolve([
                    "VERSION:",
                    "This command reports the version of various applications in the stack",
                    "format: version [COMPONENT NAME]"
                ]);
            })
        }
        let selected_component = args[0];
        if(selected_component === undefined){
            return new Promise((resolve, reject)=>{
                reject("ERROR: Missing component name");
            })
        }
        if(selected_component==="client"){
            return new Promise((resolve, reject)=>{
                resolve([
                    (__USCOPE_CLIENT_VERSION__ as string)
                ])
            })
        } else if(["server", "driver", "module", "hardware", "toolchain"].includes(selected_component)) {
           return get_version(selected_component).then((response)=>{
                return [response];
            });

        } else{
            return new Promise((resolve, reject)=>{
                reject(["ERROR: Invalid component name"]);
            })
        }
    },

    load_program:async (args:string[]): Promise<string[]> =>{
        if(args[0] === "--help"){
            return new Promise((resolve)=>{
                resolve([
                    "LOAD CORE:",
                    "This command reads the value of the specified register",
                    "format: load_program [PROGRAM NAME] [CORE ID]"
                ]);
            })
        }
        let state = store.getState() as any;
        let programs = state.programs as program[];
        let selected_program = undefined;
        for(let p of programs){
            if(p.name === args[0]){
                selected_program = p;
            }
        }
        if(selected_program === undefined){
            return new Promise((resolve, reject)=>{
                reject([
                    "ERROR: Specified program not found"
                ])
            })
        }
        selected_program = new up_program(selected_program);

        let core = __selected_application.soft_cores.filter((core)=>{
            return core.id === args[1];
        });
        if(core.length === 0){
            return new Promise((resolve, reject)=>{
                reject([
                    "ERROR: Core not found"
                ])
            })
        } else if (core.length > 1){
            return new Promise((resolve, reject)=>{
                reject([
                    "ERROR: Found multiple cores with the same id"
                ])
            })
        }
        let c = core[0];
        if(!c){
            return new Promise((resolve, reject)=>{
                reject([
                    "ERROR: Core not found"
                ])
            })
        }
        let resp = await selected_program.load(c);
        return resp.response;
    }
}

const translate_specifier = (spec: string, value: string) =>{
    let tokens = spec.split(".");
    if(tokens.length===2)
        tokens.push("value");
    let periph_name = tokens[0];
    let reg_name = tokens[1];
    let field_name = tokens[2];
    if(!periph_name || !reg_name || !field_name) return;
    let periph_obj = scripting_engine_peripherals[periph_name];
    if(!periph_obj) return;
    let reg = periph_obj.regs[reg_name]
    if(!reg) return;
    reg[field_name] = parseInt(value);
}

//   write adc_test.cmp_high_f.value 6
//   write_direct adc_test.cmp_high_f.value 6