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

import {script_register_access_log, scripting_engine_peripherals} from "../scripting/script_runner";
import {translate_registers} from "../scripting/backend";
import {up_peripheral} from "../data_models/up_peripheral";

export const terminal_backend = {
    write: (args) =>{
        if(args[0] === "--help"){
            return [
                "WRITE:",
                "This command adds a write request to the queue for batch execution",
                "NOTE: When accessing single fields the whole register gets written anyway",
                "the default value for non accessed fields is 0",
                "format: write [REGISTER/FIELD] [VALUE]"
            ]
        }
        let register = args[0];
        let value = args[1];
        translate_specifier(register,value);
        return []
    },
    write_direct:(args) =>{
        if(args[0] === "--help"){
            return [
                "WRITE DIRECT:",
                "This command immediately writes to the specified register",
                "NOTE: This command can only write full registers",
                "format: write_direct [REGISTER] [VALUE]"
            ]
        }
        let register = args[0];
        let value = args[1];
        translate_specifier(register,value);
        let writes = translate_registers(script_register_access_log, scripting_engine_peripherals);
        script_register_access_log.length = 0;
        up_peripheral.bulk_register_write({payload: writes}).then();
        return []
    },
    clear_queue:(args) =>{
        if(args[0] === "--help"){
            return [
                "CLEAR QUEUE:",
                "This command clears the write command queue",
                "format: clear_queue"
            ]
        }
        script_register_access_log.length = 0;
        return []
    },
    execute_queue:(args) =>{
        if(args[0] === "--help"){
            return [
                "EXECUTE QUEUE:",
                "This command executes the write command queue",
                "format: execute_queue"
            ]
        }

        let writes = translate_registers(script_register_access_log, scripting_engine_peripherals);
        script_register_access_log.length = 0;
        up_peripheral.bulk_register_write({payload: writes}).then();
        return []
    },
    read:(args) =>{
        if(args[0] === "--help"){
            return [
                "READ:",
                "This command reads the value of the specified register",
                "format: read [REGISTER]"
            ]
        }
        let register = args[0];
        return []
    }
}

const translate_specifier = (spec, value) =>{
    let tokens = spec.split(".");
    if(tokens.length===2)
        tokens.push("value");
    let reg = scripting_engine_peripherals[tokens[0]].regs[tokens[1]]
    reg[tokens[2]] = parseInt(value);
}

//   write adc_test.cmp_high_f.value 6
//   write_direct adc_test.cmp_high_f.value 6