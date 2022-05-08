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
    ApplicationLayout,
    BlockLayout,
    ColorTheme,
    SidebarBlockLayout,
    SidebarContentLayout, SidebarLayout
} from "../../../src/components/UI_elements";


test('block_layout', () => {
    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <BlockLayout />
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('block_layout_centered', () => {
    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <BlockLayout centered/>
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('sidebar_block_layout', () => {
    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <SidebarBlockLayout />
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('sidebar_block_layout padding ', () => {
    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <SidebarBlockLayout padding={'1rem'}/>
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
})


test('sidebar_content_layout', () => {
    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <SidebarContentLayout />
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
})



test('sidebar_content_layout application', () => {
    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <SidebarContentLayout application/>
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
})



test('sidebar_content_layout peripheral', () => {
    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <SidebarContentLayout peripheral/>
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('application_layout', () => {
    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <ApplicationLayout/>
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
})


test('application_layout sidebar', () => {
    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <ApplicationLayout sidebarNeeded={true}/>
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('sidebar layout', () => {
    const tree = renderer.create(
        <ThemeProvider theme={ColorTheme}>
            <SidebarLayout/>
        </ThemeProvider>
    ).toJSON()
    expect(tree).toMatchSnapshot()
})








