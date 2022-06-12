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
import {edit_peripheral_data} from "../mock/peripherals_api";
import {mock_store} from "../mock/redux_store";

test("field creation", () => {
    let field = up_field.construct_empty("slow", "Comparators threshold 1", "ADC_processing");
    let check_field = {
            name: "slow",
            description: "",
            length: 1,
            offset: 0
        };

    expect(field).toMatchObject(check_field)
})


test("edit description", () => {
    let field = new up_field({name: "slow",description:"Slow comparator threshold", length:16, offset:16},"Comparators threshold 1", "ADC_processing")
    return field.edit_description("test description edit").then(()=>{

        let check_field = {
            name: "slow",
            description: "test description edit",
            length: 16,
            offset: 16
        };

        expect(field).toMatchObject(check_field)
        expect(edit_peripheral_data).toStrictEqual(
            { action: "edit_field", peripheral:"ADC_processing", register:"Comparators threshold 1", field_name:'slow', field:"description", value:"test description edit"}
        )
        let state = mock_store.getState();
        expect(state.peripherals.ADC_processing._get_periph().ADC_processing.registers[0].fields[0]).toMatchObject(check_field)
    })

})

test("set length", () => {
    let field = new up_field({name: "slow",description:"Slow comparator threshold", length:16, offset:16},"Comparators threshold 1", "ADC_processing")
    return field.edit_length(12).then(()=>{

        let check_field = {
            name: "slow",
            description: "Slow comparator threshold",
            length: 12,
            offset: 16
        };

        expect(field).toMatchObject(check_field)
        expect(edit_peripheral_data).toStrictEqual(
            { action: "edit_field", peripheral:"ADC_processing", register:"Comparators threshold 1", field_name:'slow', field:"length", value:12}
        )
        let state = mock_store.getState();
        expect(state.peripherals.ADC_processing._get_periph().ADC_processing.registers[0].fields[0]).toMatchObject(check_field)
    })
})


test("set offset", () => {
    let field = new up_field({name: "slow",description:"Slow comparator threshold", length:16, offset:16},"Comparators threshold 1", "ADC_processing")
    return field.edit_offset(14).then(()=>{

        let check_field = {
            name: "slow",
            description: "Slow comparator threshold",
            length: 16,
            offset: 14
        };

        expect(field).toMatchObject(check_field)
        expect(edit_peripheral_data).toStrictEqual(
            { action: "edit_field", peripheral:"ADC_processing", register:"Comparators threshold 1", field_name:'slow', field:"offset", value:14}
        )
        let state = mock_store.getState();
        expect(state.peripherals.ADC_processing._get_periph().ADC_processing.registers[0].fields[0]).toMatchObject(check_field)
    })
})


test("edit name", () => {
    let field = new up_field({name: "slow",description:"Slow comparator threshold", length:16, offset:16},"Comparators threshold 1", "ADC_processing")
    return field.edit_name("field_2").then(()=>{

        let check_field = {
            name: "field_2",
            description: "Slow comparator threshold",
            length: 16,
            offset: 16
        };

        expect(field).toMatchObject(check_field)
        expect(edit_peripheral_data).toStrictEqual(
            { action: "edit_field", peripheral:"ADC_processing", register:"Comparators threshold 1", field_name:'slow', field:"name", value:"field_2"}
        )
        let state = mock_store.getState();
        expect(state.peripherals.ADC_processing._get_periph().ADC_processing.registers[0].fields[0]).toMatchObject(check_field)
    })
})
