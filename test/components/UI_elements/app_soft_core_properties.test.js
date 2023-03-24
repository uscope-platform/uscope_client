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

import {ColorTheme, ApplicationSoftCoreProperties} from "../../../src/components/UI_elements";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'
let parent_updated = false;

let edit_args = [];
let remove_args = "";

let programs = {
    1: {
        id:1,
        name:"test_program_1",
        program_content:"",
        program_type:"asm"
    },
    2: {
        id:2,
        name:"test_program_2",
        program_content:"",
        program_type:"asm"
    }
}


let mock_application = {
    soft_cores: [
        {
            id: 'test_core',
            address: 0,
            default_program: '125'
        }
    ],
    edit_soft_core: (a1, a2, a3) => {
        edit_args.push(a1);
        edit_args.push(a2);
        edit_args.push(a3);
        return Promise.resolve();
    },
    remove_soft_core: (args) => {
        remove_args = args;
        return Promise.resolve();
    },
}

const forceUpdate = jest.fn(() => {
    parent_updated = true;
});

test('application soft core properties', async () => {

    render(
        <ThemeProvider theme={ColorTheme}>
            <ApplicationSoftCoreProperties application={mock_application} programs={programs} forceUpdate={forceUpdate} core={mock_application.soft_cores[0]}/>
        </ThemeProvider>
    )

    // Check that the edit view is closed and open it
    expect(screen.queryByLabelText("Address")).not.toBeInTheDocument()
    fireEvent.click(screen.getByLabelText("CaretDown"));

    await test_text_field("Core ID", [mock_application.soft_cores[0].id, "id", "test_change"]);

    cleanup();

    await test_select("Default Program", [mock_application.soft_cores[0].id, "default_program", "test_program_2"]);

    fireEvent.click(screen.getByText("Remove"));
    await remove_channel();

    // test closing editing view
    fireEvent.click(screen.getByLabelText("CaretUp"));
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument()
})

let cleanup = ()=>{
    parent_updated = false;
    edit_args = [];
    forceUpdate.mockClear();
}

async function test_text_field(label, expected_edit) {
    let field = screen.getByLabelText(label);
    fireEvent.change(field, {target: {value: 'test_change'}});
    fireEvent.keyDown(field, {key: 'Enter', code: 'Enter', charCode: 13})
    expect(edit_args).toStrictEqual(expected_edit);
    await waitFor(() => expect(forceUpdate).toHaveBeenCalledTimes(1));
    expect(parent_updated).toBeTruthy();
}

async function test_select(label, expected_edit) {
    let field = screen.getByLabelText(label);
    fireEvent.change(field, { target: { value: "test_program_2" } })
    expect(edit_args).toStrictEqual(expected_edit);
    await waitFor(() => expect(forceUpdate).toHaveBeenCalledTimes(1));
    expect(parent_updated).toBeTruthy();
}

async function remove_channel() {
    expect(remove_args).toBe(mock_application.soft_cores[0].id);
    await waitFor(() => expect(forceUpdate).toHaveBeenCalledTimes(1));
    expect(parent_updated).toBeTruthy();

}
