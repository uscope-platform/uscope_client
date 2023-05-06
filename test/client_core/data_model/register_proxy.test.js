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

import {construct_proxied_register, set_write_callback} from "../../../src/client_core";

let register = {
            ID: 'cmp_thr_1',
            parent_periph:"test_periph_spec",
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


test("access with callback", done => {
    let reg = construct_proxied_register(register, "test_periph_id");
    set_write_callback((periph_id, spec_id, reg_id, field_spec, field_name, access_type) =>{
        return new Promise((resolve)=>{
            expect(periph_id).toBe("test_periph_id");
            expect(spec_id).toBe("test_periph_spec");
            expect(reg_id).toBe("cmp_thr_1");
            expect(access_type).toBe("field");
            expect(field_name).toBe("slow");
            expect(field_spec).toStrictEqual({length: 16, offset: 16});
            resolve();
        })
    });
    reg.slow = 68;
    expect(reg.full_register_accessed).not.toBeTruthy();
    expect(reg.slow).toBe(68);

})