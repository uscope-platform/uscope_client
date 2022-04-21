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


import {upload_script, delete_script, edit_script} from "../../../src/client_core";
import {mock_store} from "../mock/redux_store";
import {script_creation_data, script_removal_data, script_edit_data} from "../mock/scripts_api";


test("scripts_addition", () => {

    let script_obj = { id:10, name:'new_script_10', path:`new_script_10.js`, script_content:'', triggers:''}
    return upload_script(script_obj).then((res) =>{
        let state = mock_store.getState();
        expect(state.scripts[10]).toStrictEqual(script_obj);
        let check_data = {id: "10", body: { id: 10, name: "new_script_10", path: "new_script_10.js", script_content: "", triggers: ""}}
        expect(script_creation_data).toStrictEqual( check_data);

    })
})

test("scripts_edit", () => {

    let script_edit_obj = {"script": 3, "field": "path", "value": "test_edit"}
    return edit_script(script_edit_obj).then((res) =>{
        let state = mock_store.getState();
        let check_script_obj = {id: 3, name: 'test_script', path: "test_edit", script_content: "", triggers: 'test_trigger'}
        expect(state.scripts[3]).toStrictEqual(check_script_obj);
        expect(script_edit_data).toStrictEqual({id:"3", body:script_edit_obj});

    })
})

test("scripts_deletion", () => {

    let script_obj = {id: 3, name: 'test_script', path: null, script_content: "", triggers: 'test_trigger'}
    return delete_script(script_obj).then((res) =>{
        let state = mock_store.getState();
        expect(state.scripts).not.toHaveProperty("3");
        expect(script_removal_data).toBe("3");

    })
})
