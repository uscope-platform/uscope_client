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

import {import_application, import_peripherals, up_peripheral} from "../../../src/client_core";
import {created_app_data} from "../mock/applications_api";
import {mock_store} from "../mock/redux_store";
import test_app from "./application_example.json"
import test_periphs from './peripherals_example.json'
import {created_peripheral} from "../mock/peripherals_api";

test("application import", () => {
    let app_string = JSON.stringify(test_app);
    return import_application(app_string, 1).then(()=>{
        expect(created_app_data).toStrictEqual({"test_app":test_app});
        let state = mock_store.getState();
        expect(state.applications[1]._get_app().test_app).toStrictEqual(test_app)
    })
})

test("application verification failure", () => {
    let failing_app = test_app;
    failing_app.application_name = 523;
    let app_string = JSON.stringify(failing_app);
    return expect(import_application(app_string)).rejects.toEqual(['Error at: "/application_name" --- must be string']);
})


test("peripherals import", () => {
    let periph_string = JSON.stringify(test_periphs);
    return import_peripherals(periph_string).then(()=>{
        let check_periphs = [];
        check_periphs.push({
            "payload":(new up_peripheral(test_periphs.peripherals[0]))._get_periph()
        });
        check_periphs.push({
            "payload":(new up_peripheral(test_periphs.peripherals[1]))._get_periph()
        });
        delete check_periphs[0].payload.enable_generator.registers[0].value;
        delete check_periphs[0].payload.enable_generator.registers[1].value;
        delete check_periphs[0].payload.enable_generator.registers[2].value;
        delete check_periphs[1].payload.AdcProcessing.registers[0].value;
        delete check_periphs[1].payload.AdcProcessing.registers[1].value;
        delete check_periphs[1].payload.AdcProcessing.registers[0].offset;
        delete check_periphs[1].payload.AdcProcessing.registers[1].offset;
        expect(created_peripheral).toStrictEqual(check_periphs);
        let state = mock_store.getState();

        check_periphs[0].payload.enable_generator.registers[0].value = undefined;
        check_periphs[0].payload.enable_generator.registers[1].value = undefined;
        check_periphs[0].payload.enable_generator.registers[2].value = undefined;
        check_periphs[1].payload.AdcProcessing.registers[0].value = undefined;
        check_periphs[1].payload.AdcProcessing.registers[1].value = undefined;
        expect(state.peripherals[1]._get_periph()).toStrictEqual(check_periphs[0].payload)
        let check_obj = check_periphs[1].payload;
        let result_obj = state.peripherals[2]._get_periph();
        expect(result_obj).toStrictEqual(check_obj)
    })
})

test("peripherals verification failure", () => {
    let failing_peripherals = test_periphs;
    delete  failing_peripherals.peripherals[1].version;
    let periphs_string = JSON.stringify(failing_peripherals);
    return expect(import_peripherals(periphs_string)).rejects.toEqual(['Error at: "/peripherals/1" --- must have required property \'version\'']);
})
