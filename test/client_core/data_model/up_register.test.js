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


import {up_field, up_register} from "../../../src/client_core";
import {edit_peripheral_data} from "../mock/peripherals_api";
import {mock_store} from "../mock/redux_store";

test("register creation", () => {
    let reg = up_register.construct_empty("test register", "periph_name");
    let check_reg = {
            ID: "test_register",
            register_name: "test register",
            description: "",
            direction: "",
            offset: "0x0"
        };

    expect(reg).toMatchObject(check_reg)
})


test("edit name", () => {
    let reg = up_register.construct_empty("cmp_thr_1", "ADC_processing");
    return reg.edit_name("cmp_thr_2").then(()=>{

        let check_reg = {
            ID: "cmp_thr_1",
            register_name: "cmp_thr_2",
            description: "",
            direction: "",
            offset: "0x0"
        };

        expect(reg).toMatchObject(check_reg)
        expect(edit_peripheral_data).toStrictEqual(
            { action: "edit_register", peripheral:"ADC_processing", register:"cmp_thr_1", field:"register_name", value:"cmp_thr_2"}
        )
        check_reg = {
            ID: "cmp_thr_1",
            register_name: "cmp_thr_2",
            description: "",
            direction: "",
            offset: "0x0"
        };
        let state = mock_store.getState();
        expect(state.peripherals.ADC_processing._get_periph().ADC_processing.registers[0]).toMatchObject(check_reg)
    })
});

test("edit description", () => {
    let reg = up_register.construct_empty("cmp_thr_1", "ADC_processing");
    return reg.edit_description("test change").then(()=>{

        let check_reg = {
            ID: "cmp_thr_1",
            register_name: "cmp_thr_1",
            description: "test change",
            direction: "",
            offset: "0x0"
        };

        expect(reg).toMatchObject(check_reg)
        expect(edit_peripheral_data).toStrictEqual(
            { action: "edit_register", peripheral:"ADC_processing", register:"cmp_thr_1", field:"description", value:"test change"}
        )
        let state = mock_store.getState();
        expect(state.peripherals.ADC_processing._get_periph().ADC_processing.registers[0]).toMatchObject(check_reg)
    })
})

test("edit direction", () => {
    let reg = up_register.construct_empty("cmp_thr_1", "ADC_processing");
    return reg.edit_direction({name:"direction_read", checked:true}).then(()=>{

        let check_reg = {
            ID: "cmp_thr_1",
            register_name: "cmp_thr_1",
            description: "",
            direction: "R",
            offset: "0x0"
        };

        expect(reg).toMatchObject(check_reg)
        expect(edit_peripheral_data).toStrictEqual(
            { action: "edit_register", peripheral:"ADC_processing", register:"cmp_thr_1", field:"direction", value:"R"}
        )
        let state = mock_store.getState();
        expect(state.peripherals.ADC_processing._get_periph().ADC_processing.registers[0]).toMatchObject(check_reg)
    })
})

test("edit offset", () => {
    let reg = up_register.construct_empty("cmp_thr_1", "ADC_processing");
    return reg.edit_offset("0x4").then(()=>{

        let check_reg = {
            ID: "cmp_thr_1",
            register_name: "cmp_thr_1",
            description: "",
            direction: "",
            offset: "0x4"
        };

        expect(reg).toMatchObject(check_reg)
        expect(edit_peripheral_data).toStrictEqual(
            { action: "edit_register", peripheral:"ADC_processing", register:"cmp_thr_1", field:"offset", value:"0x4"}
        )
        let state = mock_store.getState();
        expect(state.peripherals.ADC_processing._get_periph().ADC_processing.registers[0]).toMatchObject(check_reg)
    })
})

test("set fields", () => {
    let reg = up_register.construct_empty("test register", "periph_name");
    let fields = [];
    fields.push(up_field.construct_empty("test_1"));
    fields.push(up_field.construct_empty("test_2"));
    reg.set_fields(fields);

    let check_reg = {
        ID: "test_register",
        register_name: "test register",
        fields:[
            {
                name: "test_1",
                description: "",
                length: 1,
                offset: 0
            },
            {
                name: "test_2",
                description: "",
                length: 1,
                offset: 0
            }
        ],
        description: "",
        direction: "",
        offset: "0x0"
    };

    expect(reg).toMatchObject(check_reg)
})

test("edit ID", () => {
    let reg = up_register.construct_empty("cmp_thr_1", "ADC_processing");
    return reg.edit_id("cmp_thr_2").then(()=>{

        let check_reg = {
            ID: "cmp_thr_2",
            register_name: "cmp_thr_1",
            description: "",
            direction: "",
            offset: "0x0"
        };

        expect(reg).toMatchObject(check_reg)
        expect(edit_peripheral_data).toStrictEqual(
            { action: "edit_register", peripheral:"ADC_processing", register:"cmp_thr_1", field:"ID", value:"cmp_thr_2"}
        )
        let state = mock_store.getState();
        expect(state.peripherals.ADC_processing._get_periph().ADC_processing.registers[0]).toMatchObject(check_reg)
    })
})

test("add field", () => {
    let reg = up_register.construct_empty("test register", "periph_name");
    let fields = [];
    fields.push(up_field.construct_empty("test_1"));
    reg.set_fields(fields);
    reg.add_field(up_field.construct_empty("test_2"));

    let check_reg = {
        ID: "test_register",
        register_name: "test register",
        fields:[
            {
                name: "test_1",
                description: "",
                length: 1,
                offset: 0
            },
            {
                name: "test_2",
                description: "",
                length: 1,
                offset: 0
            }
        ],
        description: "",
        direction: "",
        offset: "0x0"
    };

    expect(reg).toMatchObject(check_reg)
})



test("remove register", () => {
    return up_register.remove_register("ADC_processing", "cmp_thr_2").then(()=>{

        expect(edit_peripheral_data).toStrictEqual(
            { action: "remove_register", peripheral:"ADC_processing", register:"cmp_thr_2"}
        )
        let state = mock_store.getState();
        expect(state.peripherals.ADC_processing._get_periph().ADC_processing.registers.length).toBe(0);

    })
})
