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


import {create_application, remove_application, up_application} from "../../../src/client_core";
import {mock_store} from "../mock/redux_store";
import {created_app_data, removed_app} from "../mock/applications_api";


test("application_creation", () => {
    let app = up_application.construct_empty("default");
    return create_application(app).then((res) =>{
        let check_app = {"default": {
                application_name: "default",
                bitstream: '',
                channels: [],
                channel_groups:[],
                clock_frequency: 100000000,
                initial_registers_values: [],
                macro: [],
                n_enables: 0,
                parameters: [],
                peripherals: [],
                timebase_address: ''
            }};
        expect(created_app_data).toStrictEqual(check_app);
        let state = mock_store.getState();
        expect(state.applications.default._get_app().default).toStrictEqual(check_app.default)
    })
})


test("application_removal", () => {
    return remove_application("SicDrive").then(() =>{
        let state = mock_store.getState();
        expect(state.applications).not.toHaveProperty("SicDrive");
        expect(removed_app).toBe("SicDrive");
    })
})
