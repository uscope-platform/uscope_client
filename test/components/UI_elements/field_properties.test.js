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

import React from 'react'
import 'jest-styled-components'
import {ThemeProvider} from "styled-components";

import {ColorTheme} from "../../../src/components/UI_elements";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'
import {edit_peripheral_data} from "../../client_core/mock/peripherals_api";
import {FieldProperties} from "../../../src/components/UI_elements/SidebarComponents/FieldProperties";

let parent_updated = false;


let peripheral = {
    image: 'static/Images/ADC_processing.png',
    peripheral_name: 'ADC_processing',
    registers: [
        {
            ID: 'cmp_thr_1',
            description: 'This register controls the thresholds for the low (latching mode) and low-falling (normal mode) thresholds, for the filtered (lower word) and fast acting (higher word) comparators',
            direction: 'R/W',
            fields: [
                {
                    "description": "Slow comparator threshold",
                    "length": 16,
                    "name": "slow",
                    "offset": 16
                }
            ],
            offset: '0x0',
            register_name: 'Comparators threshold 1',
            value: 0
        }
    ],
    version: '0.1',
}

const forceUpdate = jest.fn(() => {
    parent_updated = true;
});

test('field properties', async () => {

    render(
        <ThemeProvider theme={ColorTheme}>
            <FieldProperties peripheral={peripheral} forceUpdate={forceUpdate} register={peripheral.registers[0]} field={peripheral.registers[0].fields[0]}/>
        </ThemeProvider>
    )

    await test_text_field("Name", "slow1",{ action: "edit_field", peripheral:"ADC_processing", register:"Comparators threshold 1", field_name:"slow", field:"name", value:"slow1"});
    cleanup()

    await test_text_field("Description", "test_desc",{ action: "edit_field", peripheral:"ADC_processing", register:"Comparators threshold 1", field_name:"slow1", field:"description", value:"test_desc"});
    cleanup()

    await test_text_field("Address offset", "0x43",{ action: "edit_field", peripheral:"ADC_processing", register:"Comparators threshold 1", field_name:"slow1", field:"offset", value:"0x43"});
    cleanup()

    await test_text_field("Field Size", "12",{ action: "edit_field", peripheral:"ADC_processing", register:"Comparators threshold 1", field_name:"slow1", field:"length", value:"12"});
    cleanup()

    fireEvent.click(screen.getByText("Remove"));
    await remove_channel();

    // test closing editing view
    fireEvent.click(screen.getByLabelText("CaretUp"));
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument()
})

let cleanup = ()=>{
    parent_updated = false;
    forceUpdate.mockClear();
}

async function test_text_field(label, value, expected_edit) {
    let field = screen.getByLabelText(label);
    fireEvent.change(field, {target: {value: value}});
    fireEvent.keyDown(field, {key: 'Enter', code: 'Enter', charCode: 13})
    await waitFor(() => expect(forceUpdate).toHaveBeenCalledTimes(1));
    expect(edit_peripheral_data).toStrictEqual(expected_edit);
    expect(parent_updated).toBeTruthy();
}


async function remove_channel() {
    await waitFor(() => expect(forceUpdate).toHaveBeenCalledTimes(1));
    expect(edit_peripheral_data).toStrictEqual({action: "remove_field", peripheral: "ADC_processing", register: "Comparators threshold 1"});
    expect(parent_updated).toBeTruthy();

}
