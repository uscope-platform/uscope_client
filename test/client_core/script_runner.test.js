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


import {run_script, run_parameter_script} from '../../src/client_core'
import {mock_store} from "./mock/redux_store";
import {bulk_write_data_check} from "./mock/peripherals_api";



test('run_parameter_script', () => {
    return run_parameter_script(mock_store,{name:"deadtime_correction", value:"3e-6"}).then((res)=>{
        let expected_writes = [
            {address:0x43c00254, value:6},
            {address:0x42, value:4},
            {address:0x46, value:0x43c00254},
            {address:0x69, value:0x43c00254},
            {address:0x65, value:1}

        ]
        let dbg = bulk_write_data_check;
        expect(bulk_write_data_check).toStrictEqual({payload:expected_writes})
    });
})

test('run_script', () => {
    let state = mock_store.getState()
    let result = run_script(mock_store,"test_trigger", state.applications["SicDrive"].parameters, "");
    let expected_writes = [
        {address:0x43c00254, value:6},
        {address:0x42, value:4},
        {address:0x46, value:0x43c00254},
        {address:0x69, value:0x43c00254},
        {address:0x65, value:1}

    ]
    expect(result).toStrictEqual(expected_writes);
})


