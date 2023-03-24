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

import {
    ColorTheme, InputField
} from "../../../src/components/UI_elements";
import {fireEvent, render, screen} from "@testing-library/react";


let onChangeFired = false;
let onKeyDownFired = false;

let onChange = () => {
    onChangeFired =true
};

let onKeyDown = () => {
    onKeyDownFired =true
};

let perform_input_field_test = ()=>{
    let field_1 = screen.getByPlaceholderText('test_field_1')
    let field_2 = screen.getByPlaceholderText('test_field_2')

    fireEvent.change(field_1, {target: {value: 'a'}});
    expect(onChangeFired).not.toBeTruthy();
    fireEvent.keyDown(field_1,{ key: "Escape", code: "Escape", keyCode: 27, charCode: 27})
    expect(onKeyDownFired).not.toBeTruthy();

    fireEvent.change(field_2, {target: {value: 'a'}});
    expect(onChangeFired).toBeTruthy();
    fireEvent.keyDown(field_2,{ key: "Escape", code: "Escape", keyCode: 27, charCode: 27})
    expect(onKeyDownFired).toBeTruthy();
}

test('input_field events', () => {
    onChangeFired = false;
    onKeyDownFired = false;

    render(
        <ThemeProvider theme={ColorTheme}>
            <InputField onChange={undefined} onKeyDown={undefined} compact label='test_field_1'/>
            <InputField onChange={onChange} onKeyDown={onKeyDown} compact label='test_field_2'/>
        </ThemeProvider>
    )

    perform_input_field_test();

})


test('input_field events 2', () => {
    onChangeFired = false;
    onKeyDownFired = false;

    render(
        <ThemeProvider theme={ColorTheme}>
            <InputField onChange={undefined} onKeyDown={undefined} description placeholder='test_field_1'/>
            <InputField onChange={onChange} onKeyDown={onKeyDown} description placeholder='test_field_2'/>
        </ThemeProvider>
    );

    perform_input_field_test();
})



test('input_field events 3', () => {
    onChangeFired = false;
    onKeyDownFired = false;

    render(
        <ThemeProvider theme={ColorTheme}>
            <InputField onChange={undefined} onKeyDown={undefined} inline placeholder='test_field_1'/>
            <InputField onChange={onChange} onKeyDown={onKeyDown} placeholder='test_field_2'/>
        </ThemeProvider>
    )

    perform_input_field_test();

})