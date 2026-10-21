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
import {history} from "./terminal_history.js";

import store from "../../store.js";

declare const __USCOPE_CLIENT_VERSION__: string;
export type TerminalCommand = (args: string[]) => Promise<string[]>;

export const terminal_backend : Record<string, TerminalCommand> = {
    write: (args: string[]): Promise<string[]> =>{
        if(args[0] === "--help"){
            return new Promise((resolve)=>{
                resolve([
                    "WRITE:",
                    "This command adds a write request to the queue for batch execution",
                    "NOTE: When accessing single fields the whole register gets written anyway",
                    "the default value for non accessed fields is 0",
                    "The value is an integer: decimal, 0x hexadecimal or 0b binary",
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
        let n_writes = script_register_access_log.length;
        return new Promise((resolve)=>{
          resolve([n_writes + (n_writes === 1 ? " write" : " writes") + " queued"])
        })
    },
    write_direct:(args: string[]): Promise<string[]> =>{
        if(args[0] === "--help"){
            return new Promise((resolve)=>{
                resolve([
                    "WRITE DIRECT:",
                    "This command immediately writes to the specified register",
                    "NOTE: This command can only write full registers",
                    "The value is an integer: decimal, 0x hexadecimal or 0b binary",
                    "format: write_direct [REGISTER] [VALUE]"
                ]);
            })
        }
        let register = args[0];
        let value = args[1];
        if(!register || !value) return new Promise((resolve, reject)=>{
            reject(["ERROR: Missing register or value"]);
        })
        // the write queue shares the access log, it must not be sent along with this write
        let writes = with_isolated_log(()=>{
            translate_specifier(register,value);
            return translate_registers(script_register_access_log, scripting_engine_peripherals);
        });
        // a failure of the write is reported, it used to be lost
        return up_peripheral.bulk_register_write(writes).then(()=>[]);
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
        if(writes.length === 0) return new Promise((resolve)=>{
            resolve(["The write queue is empty"])
        })
        return up_peripheral.bulk_register_write(writes).then(()=>[]);
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
        // PERFORM A DUMMY WRITE TO OBTAIN THE CORRECT ADDRESS, WITHOUT TOUCHING THE WRITE QUEUE
        let access = with_isolated_log(()=>{
            translate_specifier(specifier,"0");
            return translate_registers(script_register_access_log, scripting_engine_peripherals)[0];
        });
        if(!access)
            return new Promise((resolve, reject)=>{
                reject(["ERROR: Invalid register"]);
            })
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
                reject(["ERROR: Missing component name"]);
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

    history:(args: string[]): Promise<string[]>=>{
        if(args[0] === "--help"){
            return new Promise((resolve)=>{
                resolve([
                    "HISTORY:",
                    "This command lists the commands entered in the terminal",
                    "the arrow keys up and down recall them, -c forgets them all",
                    "format: history [-c]"
                ]);
            })
        }
        if(args[0] === "-c"){
            history.clear();
            return new Promise((resolve)=>{
                resolve([])
            })
        }
        return new Promise((resolve)=>{
            resolve(history.list().map((line, i)=> String(i + 1).padStart(4) + "  " + line))
        })
    },

    load_program:async (args:string[]): Promise<string[]> =>{
        if(args[0] === "--help"){
            return new Promise((resolve)=>{
                resolve([
                    "LOAD PROGRAM:",
                    "This command loads a program on a core of the application",
                    "format: load_program [PROGRAM NAME] [CORE ID]"
                ]);
            })
        }
        let programs = store.getState().programs;
        let selected_program = undefined;
        for(let p in programs){
            if(programs[p]!.name === args[0]){
                selected_program = programs[p];
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

/// The access log doubles as the queue of the write command: runs the action with an empty log, and puts the queued
/// writes back afterwards
const with_isolated_log = <T>(action: () => T): T =>{
    let queued = script_register_access_log.splice(0);
    try {
        return action();
    } finally {
        script_register_access_log.length = 0;
        script_register_access_log.push(...queued);
    }
}

/// Decimal, hexadecimal (0x) and binary (0b) integers. parseInt does not know the binary ones, and reads "0b101" as 0
/// and "12abc" as 12
const parse_value = (text: string): number | null =>{
    if(!/^[-+]?(0x[0-9a-f]+|0b[01]+|\d+)$/i.test(text)) return null;
    let magnitude = Number(text.replace(/^[-+]/, ""));
    return text.startsWith("-") ? -magnitude : magnitude;
}

// The errors are thrown as the lines to print, as the commands reject: the terminal reports them
const translate_specifier = (spec: string, value: string) =>{
    let tokens = spec.split(".");
    if(tokens.length===2)
        tokens.push("value");
    let periph_name = tokens[0];
    let reg_name = tokens[1];
    let field_name = tokens[2];
    if(!periph_name || !reg_name || !field_name)
        throw ["ERROR: Invalid specifier '" + spec + "', the format is PERIPHERAL.REGISTER[.FIELD]"];
    let periph_obj = scripting_engine_peripherals[periph_name];
    if(!periph_obj) throw ["ERROR: Unknown peripheral '" + periph_name + "'"];
    let reg = periph_obj.regs[reg_name]
    if(!reg) throw ["ERROR: Unknown register '" + reg_name + "' in peripheral '" + periph_name + "'"];
    let parsed_value = parse_value(value);
    if(parsed_value === null) throw ["ERROR: Invalid value '" + value + "', it must be an integer (decimal, 0x hexadecimal or 0b binary)"];
    try {
        reg[field_name] = parsed_value;
    } catch (error) {
        // the register proxy refuses the fields it does not have
        throw ["ERROR: Unknown field '" + field_name + "' in register '" + reg_name + "'"];
    }
}

//   write adc_test.cmp_high_f.value 6
//   write_direct adc_test.cmp_high_f.value 6