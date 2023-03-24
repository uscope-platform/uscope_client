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

import {ColorTheme, MacroProperties} from "../../../src/components/UI_elements";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'


let parent_updated = false;

const forceUpdate = jest.fn(() =>  {parent_updated = true;});

let edit_macro_args = [];
let remove_macro_args = "";

let mock_application = {
    macro:[{ name: 'test_macro', trigger: 'test trigger'}],
    edit_macro:(a1, a2, a3) =>{
        edit_macro_args.push(a1);
        edit_macro_args.push(a2);
        edit_macro_args.push(a3);
        return Promise.resolve();
    },
    remove_macro:(args) =>{
        remove_macro_args = args;
        return Promise.resolve();
    },
}

test('macro', async () => {

    render(
        <ThemeProvider theme={ColorTheme}>
            <MacroProperties application={mock_application} forceUpdate={forceUpdate} macro={mock_application.macro[0]}/>
        </ThemeProvider>
    )
    // Check thatg the edit view is closed and open it
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument()
    fireEvent.click(screen.getByLabelText("CaretDown"));


    // Test name editing
    await test_text_field("Name", [mock_application.macro[0].name, "name", "test_change"]);


    //clean up after first test;
    cleanup();

    // Test macro removal
    await test_remove_app();

    // test closing editing view
    fireEvent.click(screen.getByLabelText("CaretUp"));
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument()
})


function cleanup(){
    parent_updated = false;
    edit_macro_args = [];
    forceUpdate.mockClear();
}


async function test_text_field(label, expected_edit) {
    let field = screen.getByLabelText(label);
    fireEvent.change(field, {target: {value: 'test_change'}});
    fireEvent.keyDown(field, {key: 'Enter', code: 'Enter', charCode: 13})
    expect(edit_macro_args).toStrictEqual(expected_edit);
    await waitFor(() => expect(forceUpdate).toHaveBeenCalledTimes(1));
    expect(parent_updated).toBeTruthy();
}

async function test_remove_app() {
    fireEvent.click(screen.getByText("Remove"));

    expect(remove_macro_args).toBe(mock_application.macro[0].name);
    await waitFor(() => expect(forceUpdate).toHaveBeenCalledTimes(1));
    expect(parent_updated).toBeTruthy();
}