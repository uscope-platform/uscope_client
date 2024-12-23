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
import {up_peripheral} from "../../../src/client_core";
import {
    created_peripheral,
    edit_peripheral_data,
    remove_peripheral_data
} from "../mock/peripherals_api";

test("peripheral creation", () => {
    let periph = up_peripheral.construct_empty(1);
    let check_periph = {"new peripheral_1":{
            name:"new peripheral_1",
            id:1,
            version:0.1,
            parametric:false,
            registers:[]
        }};

    expect(periph._get_periph()).toStrictEqual(check_periph)
})

test("remote add", () => {
    let periph = up_peripheral.construct_empty(1);
    return periph.add_remote().then(()=>{
        let check_periph =  {payload:{
            "new peripheral_1":{
                    name:"new peripheral_1",
                    id:1,
                    version:0.1,
                    parametric: false,
                    registers:[]
                }
            }};

        expect(created_peripheral).toStrictEqual([check_periph]);
        let state = mock_store.getState();
        expect(state.peripherals[1]._get_periph()).toStrictEqual(check_periph.payload)
    })
})


test("add_register", () => {
    let periph = up_peripheral.construct_empty(1);
    return periph.add_remote().then(()=>{
        return periph.add_register("test_reg").then(() => {

            expect(edit_peripheral_data).toStrictEqual({ action: "add_register",peripheral:1, register:{
                ID:"test_reg",
                description:"",
                direction:"",
                fields: [],
                offset:"0x0",
                register_name:"test_reg",
                value:0
                }});

            let check_periph =  {
                "new peripheral_1":{
                    name:"new peripheral_1",
                    id:1,
                    version:0.1,
                    registers:[{
                        ID:"test_reg",
                        description:"",
                        direction:"",
                        offset:"0x0",
                        register_name:"test_reg",
                        value:0
                    }]
                }};
            let state = mock_store.getState();
            expect(state.peripherals[1]._get_periph()).toMatchObject(check_periph)
        });
    });
});

test("edit_version", () => {
    let periph = up_peripheral.construct_empty(1);
    return periph.add_remote().then(()=>{
        return periph.set_version(0.3).then(() => {
            let check_periph =  {payload:{
                    "new peripheral_1":{
                        name:"new peripheral_1",
                        id:1,
                        version:0.3,
                        parametric:false,
                        registers:[]
                    }
                }};
            expect(edit_peripheral_data).toStrictEqual({ action: "edit_version", peripheral: 1,version:0.3});
            let state = mock_store.getState();
            expect(state.peripherals[1]._get_periph()).toStrictEqual(check_periph.payload)
        });
    });
});


test("remove peripheral", () =>{
    let periph = up_peripheral.construct_empty(1);
    return periph.add_remote().then(()=>{
        return up_peripheral.delete(periph).then(() => {
            expect(remove_peripheral_data).toBe("1");
            let peripherals = mock_store.getState().peripherals;
            expect(peripherals).not.toHaveProperty("new peripheral_1");
        });
    })
})