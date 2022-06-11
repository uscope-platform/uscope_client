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

test("register creation", () => {
    let reg = up_register.construct_empty("test register");
    let check_reg = {
            ID: "test_register",
            register_name: "test register",
            description: "",
            direction: "",
            offset: "0x0"
        };

    expect(reg).toMatchObject(check_reg)
})


test("set_register_name", () => {
    let reg = up_register.construct_empty("test register");
    reg.set_name("test rename")

    let check_reg = {
        ID: "test_register",
        register_name: "test rename",
        description: "",
        direction: "",
        offset: "0x0"
    };

    expect(reg).toMatchObject(check_reg)
})

test("set description", () => {
    let reg = up_register.construct_empty("test register");
    reg.set_description("test description")

    let check_reg = {
        ID: "test_register",
        register_name: "test register",
        description: "test description",
        direction: "",
        offset: "0x0"
    };

    expect(reg).toMatchObject(check_reg)
})



test("set direction", () => {
    let reg = up_register.construct_empty("test register");
    reg.set_direction("RW")

    let check_reg = {
        ID: "test_register",
        register_name: "test register",
        description: "",
        direction: "RW",
        offset: "0x0"
    };

    expect(reg).toMatchObject(check_reg)
})


test("set offset", () => {
    let reg = up_register.construct_empty("test register");
    reg.set_offset("0x3124")

    let check_reg = {
        ID: "test_register",
        register_name: "test register",
        description: "",
        direction: "",
        offset: "0x3124"
    };

    expect(reg).toMatchObject(check_reg)
})

test("set fields", () => {
    let reg = up_register.construct_empty("test register");
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


test("add field", () => {
    let reg = up_register.construct_empty("test register");
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
