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


import {up_register} from "../../../src/client_core/data_models/up_register";

test("register creation", () => {
    let reg = up_register.construct_empty("test register");
    let check_reg = {
            ID: "test_register",
            register_name: "test register",
            description: "",
            direction: "",
            offset: "0x0",
            register_format:"single"
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
        offset: "0x0",
        register_format:"single"
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
        offset: "0x0",
        register_format:"single"
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
        offset: "0x0",
        register_format:"single"
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
        offset: "0x3124",
        register_format:"single"
    };

    expect(reg).toMatchObject(check_reg)
})


test("set format", () => {
    let reg = up_register.construct_empty("test register");
    reg.set_format("test_format")

    let check_reg = {
        ID: "test_register",
        register_name: "test register",
        description: "",
        direction: "",
        offset: "0x0",
        register_format:"test_format"
    };

    expect(reg).toMatchObject(check_reg)
})