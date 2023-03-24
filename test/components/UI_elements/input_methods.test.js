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
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import {ThemeProvider} from "styled-components";

import {
    Button,
    ColorTheme,
    MultiSelect,
    StyledScrollbar,
    Checkbox
} from "../../../src/components/UI_elements";
import {SelectField} from "../../../src/components/UI_elements/Select";
import {fireEvent, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test('button', () => {
    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <Button />
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('multi select', () => {

    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <MultiSelect />
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()

})


test('scrollbar', () => {

    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <StyledScrollbar/>
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()

})

test('simple select', () => {

    let onChangeFired = false;
    let onChange = () => {
        onChangeFired =true
    };


    render(
        <ThemeProvider theme={ColorTheme}>
            <SelectField label="Program type" onChange={onChange} defaultValue={"opt_1"}
                         name="program_type" placeholder="opt_1" options={["opt_1", "opt_2", "opt_3"]}/>
        </ThemeProvider>
    )

    let field = screen.getByDisplayValue("opt_1")

    fireEvent.change(field, {target: {value: 'opt_2'}});
    expect(onChangeFired).toBeTruthy();
    userEvent.selectOptions(
        field,
        screen.getByRole('option', {name: 'opt_2'}),
    )
    expect(screen.getByRole('option', {name: 'opt_2'}).selected).toBe(true)
    expect(onChangeFired).toBeTruthy();
})


test('simple select', () => {

    let onChangeFired = false;
    let onChange = () => {
        onChangeFired =true
    };


    const { container } = render(
        <ThemeProvider theme={ColorTheme}>
            <Checkbox onChange={onChange} name="test_checkbox" value={onChangeFired}/>
        </ThemeProvider>
    )
    const field = container.querySelector(`input[name="test_checkbox"]`);

    fireEvent.click(field);
    expect(onChangeFired).toBeTruthy();

})
