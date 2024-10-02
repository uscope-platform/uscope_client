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
import {up_script} from "../../../src/client_core";
import {script_creation_data, script_edit_data, script_removal_data} from "../mock/scripts_api";


test("script creation", () => {
    let script = up_script.construct_empty(1);
    let check_script = {
            id:1,
            name:"new script_1",
            path:"new script_1.js",
        content:`
    function script_main(parameters, context) {
    
        let ws = []; 
        let regs = []; 
        return {workspace:ws, registers:regs};
     
    }
`,
            triggers:""
        };

    expect(script._get_script()).toStrictEqual(check_script)
})

test("remote add", () => {
    let script = up_script.construct_empty(1);
    return script.add_remote().then(()=>{
        let check_script =  {
            body:{
                id:1,
                name:"new script_1",
                path:"new script_1.js",
                content:`
    function script_main(parameters, context) {
    
        let ws = []; 
        let regs = []; 
        return {workspace:ws, registers:regs};
     
    }
`,
                triggers:""
            },
            id:"1"

        };

        expect(script_creation_data).toStrictEqual(check_script);
        let state = mock_store.getState();
        expect(state.scripts[1]._get_script()).toStrictEqual(check_script.body)
    })
})


test("set content", () => {
    let script = up_script.construct_empty(1);
    return script.add_remote().then(()=>{
        return script.edit_field("content", "TEST CONTENT").then(()=>{
            let check_script = {
                id:1,
                name:"new script_1",
                path:"new script_1.js",
                content:"TEST CONTENT",
                triggers:""
            };

            expect(script_edit_data).toStrictEqual({id:"1", body:{field:"content", script:1,value:"TEST CONTENT"}});
            let state = mock_store.getState();
            expect(state.scripts[1]._get_script()).toStrictEqual(check_script);
        });


    })
})


test("delete script", () => {
    let script = up_script.construct_empty(10);
    return script.add_remote().then(()=>{
        return up_script.delete(script).then(()=>{
            expect(script_removal_data).toStrictEqual(script.id.toString());
            let scripts = mock_store.getState().scripts;
            expect(scripts).not.toHaveProperty(script.id.toString());
        })
    })
})
