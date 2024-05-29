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
    complete_command,
    current_line,
    prefix,
    init_test_terminal, set_current_line, terminal, execute_command, handle_keypress, complete_address, clear_terminal
} from "../../../src/client_core/terminal/terminal";
import {
    terminal_backend
} from "../../../src/client_core/terminal/terminal_backend";
import {initialize_scripting_engine} from "../../../src/client_core";


let app = {
    application_name: "SicDrive",
    id:1,
    peripherals: [
        {
            base_address: "0xAC",
            name: "adc_test",
            peripheral_id: "adc_test",
            proxied: false,
            proxy_address: "0",
            spec_id: 1,
            type: "Registers"
        },
        {
            hdl_parameters: {
                N_CHANNELS: 2
                ,
                N_SHIFT_REGS: 3
            },
            base_address: "0x30",
            name: "adc_param",
            peripheral_id: "adc_param",
            proxied: false,
            proxy_address: "0",
            spec_id: 2,
            type: "Registers"
        }
    ]
}

let periph = {
    1: {
        peripheral_name: "AdcProcessing2",
        id:1,
        version: "1.0",
        parametric:false,
        registers: [
            {
                "parent_periph": "AdcProcessing2",
                "ID": "cmp_low_r",
                "register_name": "cmp_low_r",
                "description": "Low and rising comparator threshold in normal mode",
                "direction": "RW",
                "offset": "0x4",
                "fields": [
                    {
                        "name": "faste",
                        "parent_register": "cmp_low_r",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "uyf",
                        "length": "9",
                        "offset": "6"
                    },
                    {
                        "name": "slow",
                        "parent_register": "cmp_low_r",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Slow comparator threshold",
                        "length": 16,
                        "offset": 16
                    }
                ]
            },
            {
                "parent_periph": "AdcProcessing2",
                "ID": "cmp_high_f",
                "register_name": "cmp_high_f",
                "description": "high and falling comparator threshold in normal mode",
                "direction": "RW",
                "offset": "0x8",
                "fields": [
                    {
                        "name": "fast",
                        "parent_register": "cmp_high_f",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Fast comparator treshold",
                        "length": 16,
                        "offset": 0
                    },
                    {
                        "name": "slow",
                        "parent_register": "cmp_high_f",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Slow comparator threshold",
                        "length": 16,
                        "offset": 16
                    }
                ]
            },
            {
                "parent_periph": "AdcProcessing2",
                "ID": "cmp_h_r",
                "register_name": "cmp_h_r",
                "description": "High comparator threshold (rising in normal mode)",
                "direction": "RW",
                "offset": "0xc",
                "fields": [
                    {
                        "name": "fast",
                        "parent_register": "cmp_h_r",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Fast comparator treshold",
                        "length": 16,
                        "offset": 0
                    },
                    {
                        "name": "slow",
                        "parent_register": "cmp_h_r",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Slow comparator threshold",
                        "length": 16,
                        "offset": 16
                    }
                ]
            },
            {
                "parent_periph": "AdcProcessing2",
                "ID": "cal_coeff",
                "register_name": "cal_coeff",
                "description": "Calibration coefficients",
                "direction": "RW",
                "offset": "0x10",
                "fields": [
                    {
                        "name": "offset",
                        "parent_register": "cal_coeff",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Fast comparator treshold",
                        "length": 16,
                        "offset": 16
                    }
                ]
            },
            {
                "parent_periph": "AdcProcessing2",
                "ID": "control",
                "register_name": "control",
                "description": "ADC post processing module control register",
                "direction": "RW",
                "offset": "0x14",
                "fields": [
                    {
                        "name": "latch_mode",
                        "parent_register": "control",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Toggles comparators between normal and latching mode",
                        "length": 2,
                        "offset": 1
                    },
                    {
                        "name": "clear_latch",
                        "parent_register": "control",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Clear comparators latch when in latching mode",
                        "length": 2,
                        "offset": 3
                    },
                    {
                        "name": "cal_shift",
                        "parent_register": "control",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Ammount of bits the data will be shifted right by (gain)",
                        "length": 3,
                        "offset": 5
                    },
                    {
                        "name": "fault_delay",
                        "parent_register": "control",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Amount of clock cycles a slow comparator must be active before triggering a fault",
                        "length": 8,
                        "offset": 8
                    },
                    {
                        "name": "clear_fault",
                        "parent_register": "control",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Clear sticky fault satus",
                        "length": 1,
                        "offset": 16
                    },
                    {
                        "name": "fault_disable",
                        "parent_register": "control",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Disable fault generation",
                        "length": 1,
                        "offset": 17
                    },
                    {
                        "name": "decimation",
                        "parent_register": "control",
                        "parent_peripheral": "AdcProcessing2",
                        "description": "Decimation ratio between input and output data",
                        "length": 8,
                        "offset": 24
                    }
                ]
            }
        ]
    },
    2: {
        peripheral_name: "AdcProcessing_param",
        version: "1.0",
        id:2,
        parametric:true,
        registers: [
            {
                parent_periph: "AdcProcessing_param",
                ID: "cmp_low_f",
                order: 0,
                fields: [
                    {
                        name: "test_field_$",
                        order: 0,
                        length: 2,
                        offset: 0,
                        n_fields: [
                            "N_SHIFT_REGS"
                        ],
                        parent_register: "cmp_low_f",
                        parent_peripheral: "AdcProcessing_param",
                        description: "Fast comparator treshold"
                    },
                    {
                        name: "test_field_simple",
                        order: 1,
                        length: 16,
                        offset: 6,
                        n_fields: [
                            "1"
                        ],
                        parent_register: "cmp_low_f",
                        parent_peripheral: "AdcProcessing_param",
                        description: "Fast comparator treshold"
                    }
                ],
                direction: "RW",
                description: "Low comparator threshold (falling when in normal mode)",
                n_registers: ["1"],
                register_name: "cmp_low_f"
            },
            {
                ID: "offset_$",
                order: 1,
                parent_periph: "AdcProcessing_param",
                fields: [],
                direction: "RW",
                description: "Offset calibration coefficient",
                n_registers: ["N_CHANNELS"],
                register_name: "offset_$"
            },
            {
                ID: "filter_tap_address",
                order: 2,
                parent_periph: "AdcProcessing_param",
                fields: [],
                direction: "RW",
                description: "Fir Filter tap address value",
                n_registers: [
                    "1"
                ],
                register_name: "filter_tap_address"
            }
        ]
    }
}

test("prefix_extraction", () => {
    expect(prefix(["write", "write_direct"])).toBe("write");
    expect(prefix(["write", "test"])).toBe("");
})

test("complete_command", ()=>{
    init_test_terminal();
    //No ambiguity
    set_current_line("re");
    complete_command();
    expect(current_line).toBe("read");
    expect(terminal._test_get_content()).toStrictEqual(["\r\n$ ", "read"]);
    terminal._test_clear_buffer();
    // Ambiguous command 2 choices
    set_current_line("wr");
    complete_command();
    expect(current_line).toBe("write");
    expect(terminal._test_get_content()).toStrictEqual(["\r\n\u001b[34mwrite   write_direct\u001b[37m", "\r\n$ ", "write"]);
    terminal._test_clear_buffer();
    // Ambiguous command 1 match
    set_current_line("write");
    complete_command();
    expect(current_line).toBe("write");
    expect(terminal._test_get_content()).toStrictEqual(["\r\n\u001b[34mwrite   write_direct\u001b[37m", "\r\n$ ", "write"]);
    terminal._test_clear_buffer();
    // Ambiguous command 1 choices
    set_current_line("write_");
    complete_command();
    expect(current_line).toBe("write_direct");
    expect(terminal._test_get_content()).toStrictEqual(["\r\n$ ", "write_direct"]);
})


test("complete_peripheral", ()=>{
    terminal._test_clear_buffer();
    initialize_scripting_engine(app, periph);
    init_test_terminal();
    //No ambiguity
    set_current_line("write adc_t");
    complete_address();
    expect(current_line).toBe("write adc_test");
    expect(terminal._test_get_content()).toStrictEqual(["est"]);
    terminal._test_clear_buffer();
    // Ambiguous command 2 choices
    set_current_line("write a");
    complete_address();
    expect(current_line).toBe("write adc_");
    expect(terminal._test_get_content()).toStrictEqual(["\r\n\u001b[34madc_test         adc_param\u001b[37m", "\r\n$ ", "write adc_"]);

})



test("test_execute_commands", ()=>{
    init_test_terminal();
    terminal._test_clear_buffer();
    set_current_line("wrong_test");
    execute_command("wrong_test")
    expect(terminal._test_get_content()).toStrictEqual(['\r\n\x1b[1;31mUnrecognized command: wrong_test\x1b[37m']);

    const read_spy = vi.spyOn(terminal_backend, "read");
    const write_spy = vi.spyOn(terminal_backend, "write");
    const write_direct_spy = vi.spyOn(terminal_backend, "write_direct");
    const execute_spy = vi.spyOn(terminal_backend, "execute_queue");
    const clear_spy = vi.spyOn(terminal_backend, "clear_queue");

    execute_command("read --help")
    execute_command("write --help")
    execute_command("write_direct --help")
    execute_command("execute_queue --help")
    execute_command("clear_queue --help")


    expect(read_spy).toHaveBeenCalledTimes(1);
    expect(write_spy).toHaveBeenCalledTimes(1);
    expect(write_direct_spy).toHaveBeenCalledTimes(1);
    expect(execute_spy).toHaveBeenCalledTimes(1);
    expect(clear_spy).toHaveBeenCalledTimes(1);
})


test("test_regular_key", ()=>{
    init_test_terminal();
    set_current_line("");
    terminal._test_clear_buffer();
    handle_keypress("r");
    expect(current_line).toBe("r");
    expect(terminal._test_get_content()).toStrictEqual(["r"]);
})

test("test_delete_key", ()=>{
    init_test_terminal();
    terminal._test_clear_buffer();
    set_current_line("");
    handle_keypress("r");
    handle_keypress("e");
    handle_keypress("");
    expect(current_line).toBe("r");
    expect(terminal._test_get_content()).toStrictEqual(["r", "e", "\b \b"]);
})

test("test_delete_key", ()=>{
    init_test_terminal();
    terminal._test_clear_buffer();
    set_current_line("");
    handle_keypress("r");
    handle_keypress("e");
    handle_keypress("");
    expect(current_line).toBe("r");
    expect(terminal._test_get_content()).toStrictEqual(["r", "e", "\b \b"]);
})


test("test_return_key", ()=>{
    init_test_terminal();
    terminal._test_clear_buffer();
    const write_spy = vi.spyOn(terminal_backend, "write");
    set_current_line("write --help");
    return handle_keypress("\r").then((response)=>{
        expect(write_spy).toHaveBeenCalledTimes(1);
        expect(current_line).toBe("");
        expect(terminal._test_get_content()).toStrictEqual(
            [
                "\r\n\u001b[32mWRITE:\u001b[37m",
                "\r\n\u001b[32mThis command adds a write request to the queue for batch execution\u001b[37m",
                "\r\n\u001b[32mNOTE: When accessing single fields the whole register gets written anyway\u001b[37m",
                "\r\n\u001b[32mthe default value for non accessed fields is 0\u001b[37m",
                "\r\n\u001b[32mformat: write [REGISTER/FIELD] [VALUE]\u001b[37m",
                "\r\n$ "
            ]
        );
    })

})


test("test_tab_key", ()=>{
    init_test_terminal();
    terminal._test_clear_buffer();
    set_current_line("re");

    handle_keypress("\t")
    expect(current_line).toBe("read");
    expect(terminal._test_get_content()).toStrictEqual(["\r\n$ ","read"]);
})