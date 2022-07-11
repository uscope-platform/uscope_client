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

import {construct_proxied_register} from "../../../src/client_core";

let register = {
            ID: 'cmp_thr_1',
            description: 'This register controls the thresholds for the low (latching mode) and low-falling (normal mode) thresholds, for the filtered (lower word) and fast acting (higher word) comparators',
            direction: 'R/W',
            offset: '0x0',
            register_name: 'Comparators threshold 1',
            fields: [
                {
                    "description": "Slow comparator threshold",
                    "length": 16,
                    "name": "slow",
                    "offset": 16
                },
                {
                    "description": "test field",
                    "length": 4,
                    "name": "test",
                    "offset": 2
                }
            ],
            value: 0
        }



test('field masks', () => {
    let reg = construct_proxied_register(register);
    let check_masks = {
        test: 60,
        slow: 0xFFFF0000
    };

    expect(reg.fields_masks).toStrictEqual(check_masks);
})


test('access full register', () => {
    let reg = construct_proxied_register(register);
    reg.value = 142;
    expect(reg.full_register_accessed).toBeTruthy();
    expect(reg.full_register_value).toBe(142);
})


test('access field', () => {
    let reg = construct_proxied_register(register);
    reg.slow = 68;
    expect(reg.full_register_accessed).not.toBeTruthy();
    expect(reg.slow).toBe(68);
})
