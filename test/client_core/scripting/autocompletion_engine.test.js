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
import {autocompletion_engine, initialize_scripting_engine, run_parameter_script} from "../../../src/client_core";
import {mock_store} from "../mock/redux_store";
import {bulk_write_data_check} from "../mock/peripherals_api";
import {scripting_engine_peripherals} from "../../../src/client_core/scripting/script_runner";

let app = {
    "application_name": "SicDrive",
    "peripherals": [
        {
            "base_address": "0",
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
    "AdcProcessing2": {
        "peripheral_name": "AdcProcessing2",
        "version": "1.0",
        "registers": [
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


test('autocomplete_this', () => {
    initialize_scripting_engine(app, periph);
    let periph_line = {
        "from": 204,
        "to": 206,
        "text": "th"
    }
    initialize_scripting_engine(app, periph)
    let res = autocompletion_engine(periph_line);
    expect(res).toStrictEqual([{"label": "this", "type": "keyword"}]);
})

test('autocomplete_peripheral', () => {
    initialize_scripting_engine(app, periph);
    let periph_line = {
        "from": 204,
        "to": 210,
        "text": "this.a"
    }
    initialize_scripting_engine(app, periph)
    let res = autocompletion_engine(periph_line);
    expect(res).toStrictEqual([{"label": "adc_test", "type": "keyword"}]);
})

test('autocomplete_register', () => {
    initialize_scripting_engine(app, periph);
    let register_line = {
        "from": 204,
        "to": 218,
        "text": "this.adc_test."
    }
    initialize_scripting_engine(app, periph)
    let res = autocompletion_engine(register_line);
    expect(res).toStrictEqual([
        {"label": "cmp_low_r", "type": "keyword"},
        {"label": "cmp_high_f", "type": "keyword"},
        {"label": "cmp_h_r", "type": "keyword"},
        {"label": "cal_coeff", "type": "keyword"},
        {"label": "control", "type": "keyword"}
    ]);
})

test('autocomplete_field', () => {
    initialize_scripting_engine(app, periph);
    let field_line = {
        "from": 204,
        "to": 226,
        "text": "this.adc_test.cmp_h_r."
    }
    initialize_scripting_engine(app, periph)
    let res = autocompletion_engine(field_line);
    expect(res).toStrictEqual([
        {"label": "fast", "type": "keyword"},
        {"label": "slow", "type": "keyword"},
        {"label": "value", "type": "keyword"}
    ]);
})



