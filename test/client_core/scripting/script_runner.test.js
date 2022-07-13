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


import {run_script, run_parameter_script, initialize_scripting_engine} from '../../../src/client_core'
import {mock_store} from "../mock/redux_store";
import {bulk_write_data_check} from "../mock/peripherals_api";
import {scripting_engine_peripherals} from "../../../src/client_core/scripting/script_runner";



let app = {
    "application_name": "SicDrive",
    "peripherals": [
        {
            "base_address": "0xAC",
            "name": "adc_test",
            "peripheral_id": "adc_test",
            "proxied": false,
            "proxy_address": "0",
            "spec_id": "AdcProcessing2",
            "type": "Registers"
        }
    ],
}

let periph = {
    AdcProcessing2: {
        peripheral_name: "AdcProcessing2",
        version: "1.0",
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
}


test('scripting_engine_initialization', () => {
    initialize_scripting_engine(app, periph)
    let expected_sep = {
        adc_test: {
            regs:{
                cmp_low_r: {
                    field_specs:{
                        faste:{
                            length:"9",
                            offset:"6"
                        },
                        slow:{
                            length:16,
                            offset:16
                        }
                    },
                    full_register_accessed: false,
                    full_register_value: 0,
                    faste: 0,
                    slow: 0,
                    peripheral_id: "adc_test",
                    peripheral_spec_id: "AdcProcessing2",
                    register_id: "cmp_low_r",
                },
                cmp_high_f: {
                    field_specs:{
                        fast:{
                            length:16,
                            offset:0
                        },
                        slow:{
                            length:16,
                            offset:16
                        }
                    },
                    full_register_accessed: false,
                    full_register_value: 0,
                    fast: 0,
                    slow: 0,
                    peripheral_id: "adc_test",
                    peripheral_spec_id: "AdcProcessing2",
                    register_id: "cmp_high_f",
                },
                cmp_h_r: {
                    field_specs:{
                        fast:{
                            length:16,
                            offset:0
                        },
                        slow:{
                            length:16,
                            offset:16
                        }
                    },
                    full_register_accessed: false,
                    full_register_value: 0,
                    fast: 0,
                    slow: 0,
                    peripheral_id: "adc_test",
                    peripheral_spec_id: "AdcProcessing2",
                    register_id: "cmp_h_r",
                },
                cal_coeff: {
                    field_specs:{
                        offset:{
                            length:16,
                            offset:16
                        }
                    },
                    full_register_accessed: false,
                    full_register_value: 0,
                    offset: 0,
                    peripheral_id: "adc_test",
                    peripheral_spec_id: "AdcProcessing2",
                    register_id: "cal_coeff",
                },
                control: {
                    field_specs:{
                        cal_shift:{
                                length:3,
                                offset:5
                        },
                        clear_fault: {
                            length:1,
                            offset:16
                        },
                        clear_latch: {
                            length:2,
                            offset:3
                        },
                        decimation: {
                            length:8,
                            offset:24
                        },
                        fault_delay:{
                            length:8,
                            offset:8
                        },
                        fault_disable: {
                            length:1,
                            offset:17
                        },
                        latch_mode:{
                            length:2,
                            offset:1
                        }
                    },
                    full_register_accessed: false,
                    full_register_value: 0,
                    latch_mode: 0,
                    clear_latch: 0,
                    cal_shift: 0,
                    fault_delay: 0,
                    clear_fault: 0,
                    fault_disable: 0,
                    decimation: 0,
                    peripheral_id: "adc_test",
                    peripheral_spec_id: "AdcProcessing2",
                    register_id: "control",
                }
            },
            periph_obj:app.peripherals[0],
            spec_obj: {
                peripheral_name: "AdcProcessing2",
                version: "1.0",
                registers: [
                    {
                        ID: "cmp_low_r",
                        register_name: "cmp_low_r",
                        description: "Low and rising comparator threshold in normal mode",
                        direction: "RW",
                        offset: "0x4",
                        fields: [
                            {
                                name: "faste",
                                description: "uyf",
                                length: "9",
                                offset: "6"
                            },
                            {
                                name: "slow",
                                description: "Slow comparator threshold",
                                length: 16,
                                offset: 16
                            }
                        ]
                    },
                    {
                        ID: "cmp_high_f",
                        register_name: "cmp_high_f",
                        description: "high and falling comparator threshold in normal mode",
                        direction: "RW",
                        offset: "0x8",
                        fields: [
                            {
                                name: "fast",
                                description: "Fast comparator treshold",
                                length: 16,
                                offset: 0
                            },
                            {
                                name: "slow",
                                description: "Slow comparator threshold",
                                length: 16,
                                offset: 16
                            }
                        ]
                    },
                    {
                        ID: "cmp_h_r",
                        register_name: "cmp_h_r",
                        description: "High comparator threshold (rising in normal mode)",
                        direction: "RW",
                        offset: "0xc",
                        fields: [
                            {
                                name: "fast",
                                description: "Fast comparator treshold",
                                length: 16,
                                offset: 0
                            },
                            {
                                name: "slow",
                                description: "Slow comparator threshold",
                                length: 16,
                                offset: 16
                            }
                        ]
                    },
                    {
                        ID: "cal_coeff",
                        register_name: "cal_coeff",
                        description: "Calibration coefficients",
                        direction: "RW",
                        offset: "0x10",
                        fields: [
                            {
                                name: "offset",
                                description: "Fast comparator treshold",
                                length: 16,
                                offset: 16
                            }
                        ]
                    },
                    {
                        ID: "control",
                        register_name: "control",
                        description: "ADC post processing module control register",
                        direction: "RW",
                        offset: "0x14",
                        fields: [
                            {
                                name: "latch_mode",
                                description: "Toggles comparators between normal and latching mode",
                                length: 2,
                                offset: 1
                            },
                            {
                                name: "clear_latch",
                                description: "Clear comparators latch when in latching mode",
                                length: 2,
                                offset: 3
                            },
                            {
                                name: "cal_shift",
                                description: "Ammount of bits the data will be shifted right by (gain)",
                                length: 3,
                                offset: 5
                            },
                            {
                                name: "fault_delay",
                                description: "Amount of clock cycles a slow comparator must be active before triggering a fault",
                                length: 8,
                                offset: 8
                            },
                            {
                                name: "clear_fault",
                                description: "Clear sticky fault satus",
                                length: 1,
                                offset: 16
                            },
                            {
                                name: "fault_disable",
                                description: "Disable fault generation",
                                length: 1,
                                offset: 17
                            },
                            {
                                name: "decimation",
                                description: "Decimation ratio between input and output data",
                                length: 8,
                                offset: 24
                            }
                        ]
                    }
                ]
            }
        }
    }

    expect(scripting_engine_peripherals).toEqual(expected_sep)
})

test('run_parameter_script', () => {
    return run_parameter_script(mock_store,{name:"deadtime_correction", value:"3e-6"}).then((res)=>{
        let expected_writes = [
            {type:"direct", proxy_type:"", proxy_address:0, address:0x43c00254, value:6},
            {type:"proxied", proxy_type:"rtcu", proxy_address:0x42,address:0x43c00254, value:4},
            {type:"proxied", proxy_type:"axis_const", proxy_address:0x65, address:0x43c00254, value:1},
            {type:"direct", proxy_type:"", proxy_address:0, address:0xB0, value:5},
            {type:"direct", proxy_type:"", proxy_address:0, address:0xB4, value:0x30006}

        ]
        expect(bulk_write_data_check).toStrictEqual({payload:expected_writes})
    });
})

test('run_script', () => {
    let state = mock_store.getState()
    let result = run_script(mock_store,"test_trigger", state.applications["SicDrive"].parameters, "");
    let expected_writes = [
        {type:"direct", proxy_type:"", proxy_address:0, address:0x43c00254, value:6},
        {type:"proxied", proxy_type:"rtcu", proxy_address:0x42, address:0x43c00254, value:4},
        {type:"proxied", proxy_type:"axis_const", proxy_address:0x65, address:0x43c00254, value:1},
        {type:"direct", proxy_type:"", proxy_address:0, address:0xB0, value:5},
        {type:"direct", proxy_type:"", proxy_address:0, address:0xB4, value:0x30006}
    ]
    expect(result).toStrictEqual(expected_writes);
})
