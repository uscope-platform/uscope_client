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

import {mock_store} from "../mock/redux_store";
import {up_program} from "../../../src/client_core";
import {
    applied_program_data, compile_program_data,
    created_program_data,
    edit_program_data,
    removed_program_data
} from "../mock/programs_api";



test("program creation", () => {
    let program = up_program.construct_empty(1);
    let check_program = {
            id:1,
            build_settings: {
                io: [],
            },
            name:"new program_1",
            program_content:'',
            program_type:''
        };

    expect(program._get_program()).toStrictEqual(check_program)
})

test("remote add", () => {
    let program = up_program.construct_empty(1);
    return program.add_remote().then(()=>{
        let check_program =  {
            body:{
                id:1,
                build_settings: {
                    io: [],
                },
                name:"new program_1",
                program_content:'',
                program_type:''
            },
            id:"1"
        };

        expect(created_program_data).toStrictEqual(check_program);
        let state = mock_store.getState();
        expect(state.programs[1]._get_program()).toStrictEqual(check_program.body)
    })
})


test("set content", () => {
    let program = up_program.construct_empty(1);
    return program.add_remote().then(()=>{
        return program.set_content("TEST CONTENT").then(()=>{
            let check_program = {
                id:1,
                build_settings: {
                    io: [],
                },
                name:"new program_1",
                program_content:'TEST CONTENT',
                program_type:''
            };

            expect(edit_program_data).toStrictEqual({id:"1", body:{field:"program_content", program:1, value:"TEST CONTENT"}});
            let state = mock_store.getState();
            expect(state.programs[1]._get_program()).toStrictEqual(check_program);
        });


    })
})



test("delete program", () => {
    let program = up_program.construct_empty(10);
    return program.add_remote().then(()=>{
        return up_program.delete(program).then(()=>{
                expect(removed_program_data).toStrictEqual(program.id.toString());
            let programs = mock_store.getState().programs;
            expect(programs).not.toHaveProperty(program.id.toString());
        })
    })
})


test("compile program", () => {
    let program = up_program.construct_empty(10);
    return program.add_remote().then(()=>{
        return program.compile().then(()=>{
            expect(compile_program_data).toStrictEqual("10");
        })
    })
})

test("load program", () => {
    let program = up_program.construct_empty(10);
    return program.add_remote().then(()=>{
        return program.load('0x83c00000').then(()=>{
            let check_obj = {
                body: {
                    build_settings: {
                        io: [],
                    },
                    core_id: "0x83c00000",
                    id: 10,
                    name: "new program_10",
                    program_content: "",
                    program_type: ""
                },
                id: "10"
            }
            expect(applied_program_data).toStrictEqual(check_obj);
        })
    })
})
