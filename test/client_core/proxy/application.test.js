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


import {create_application, remove_application, edit_application} from "../../../src/client_core";
import {mock_store} from "../mock/redux_store";
import {create_application_object, create_irv} from "../../../src/utilities/ApplicationUtilities";
import {created_app_data, removed_app, edit_app_data} from "../mock/applications_api";


test("application_creation", () => {
    let app = create_application_object("default");
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
        expect(state.applications.default).toStrictEqual(check_app.default)
    })
})


test("application_removal", () => {
    return remove_application("SicDrive").then(() =>{
        let state = mock_store.getState();
        expect(state.applications).not.toHaveProperty("SicDrive");
        expect(removed_app).toBe("SicDrive");
    })
})


test("application_edit", () => {
    let og_app = mock_store.getState().applications.SicDrive
    let edit = {application:"SicDrive", irv:create_irv("0x320"), action:"add_irv"};
    return edit_application(edit).then(()=>{
        og_app.initial_registers_values.push(create_irv("0x320"));
        expect(edit_app_data).toStrictEqual(edit);
        expect( mock_store.getState().applications.SicDrive).toStrictEqual(og_app);

    })
})