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

import {upload_program, edit_program, delete_program, apply_program, compile_program} from "../../../src/client_core";
import {mock_store} from "../mock/redux_store";
import {
    applied_program_data,
    compile_program_data,
    created_program_data,
    edit_program_data,
    removed_program_data
} from '../mock/programs_api'


test("program_addition", () => {

    let program_obj = {
        "id": 2,
        "name": "new_program_2",
        "program_content": "dGVzdF9iaXRzdHJlYW0K",
        "program_type": "asm"
    }
    return upload_program(program_obj).then((res) =>{
        let state = mock_store.getState();
        expect(state.programs[2]).toStrictEqual(program_obj);
        let check_data = {
            id: '2',
            body: { id: 2, name: 'new_program_2', program_content: 'dGVzdF9iaXRzdHJlYW0K', program_type: "asm" }
        }
        expect(created_program_data).toStrictEqual( check_data);

    })
})

test("program_edit", () => {

    let  edit = {program:1, field:"name", value:"test_edit"}
    return edit_program(edit).then(()=>{
        let state = mock_store.getState();
        let check_data = {
            id: '1',
            body:{program:1, field:"name", value:"test_edit"}
        }
        expect(state.programs[1]).toStrictEqual(
            {
                "id": 1,
                "name": "test_edit",
                "program_content": "iocbnojrenjcor",
                "program_type": "asm"
            }
        );
        expect(edit_program_data).toStrictEqual(check_data);
    })
})


test("program_deletion", () => {
    let bitstream_obj = {
        "id": 1,
        "name": "new_program_2"
    }
    return delete_program(bitstream_obj).then((res) =>{
        let state = mock_store.getState();
        expect(state.programs).not.toHaveProperty("1");
        expect(removed_program_data).toBe("1");
    })
})




test("program apply", () => {
    let program = {
        hex: [12],
        id: 1,
        name: "cl_pir_harmonic_el",
        program_content: "",
        program_type: "",
        core_address: "0x83c00000"
    }
    return apply_program(program).then((res) =>{
        let check_data = {
            id: '1',
            body: {
                hex: [12],
                id: 1,
                name: "cl_pir_harmonic_el",
                program_content: "",
                program_type: "",
                core_address: "0x83c00000"
            }
        }
        expect(applied_program_data).toStrictEqual( check_data);
    })
})


test("program compile", () => {
    let program = {
        hex: [],
        id: 1,
        name: "cl_pir_harmonic_el",
        program_content: "",
        program_type: "",
        core_address: "0x83c00000"
    }
    return compile_program(program).then((res) =>{
        expect(compile_program_data).toStrictEqual( "1");
    })
})




