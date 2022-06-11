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

import {up_field} from "../../../src/client_core";

test("field creation", () => {
    let field = up_field.construct_empty("test field");
    let check_field = {
            name: "test field",
            description: "",
            length: 1,
            offset: 0
        };

    expect(field).toMatchObject(check_field)
})


test("set_register_name", () => {
    let field = up_field.construct_empty("test field");
    field.set_name("test rename")

    let check_field = {
        name: "test rename",
        description: "",
        length: 1,
        offset: 0
    };

    expect(field).toMatchObject(check_field)
})

test("set description", () => {
    let field = up_field.construct_empty("test field");
    field.set_description("test description")

    let check_field = {
        name: "test field",
        description: "test description",
        length: 1,
        offset: 0
    };

    expect(field).toMatchObject(check_field)
})



test("set length", () => {
    let field = up_field.construct_empty("test field");
    field.set_length(16)

    let check_field = {
        name: "test field",
        description: "",
        length: 16,
        offset: 0
    };

    expect(field).toMatchObject(check_field)
})


test("set offset", () => {
    let field = up_field.construct_empty("test field");
    field.set_offset(0x3124)

    let check_field = {
        name: "test field",
        description: "",
        length: 1,
        offset: 0x3124
    };

    expect(field).toMatchObject(check_field)
})
