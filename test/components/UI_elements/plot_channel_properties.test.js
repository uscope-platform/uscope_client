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

import {ColorTheme, PlotChannelProperties} from "../../../src/components/UI_elements";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'

let parent_updated = false;

let edit_channel_args = [];
let remove_channel_args = "";


let mock_application = {
    channels: [
        {
            enabled: true,
            id: 2,
            max_value: 180,
            min_value: 0,
            mux_setting: '0',
            name: 'Current B',
            number: '1',
            phys_width: '14'
        }
    ],
    edit_channel: (a1, a2, a3) => {
        edit_channel_args.push(a1);
        edit_channel_args.push(a2);
        edit_channel_args.push(a3);
        return Promise.resolve();
    },
    remove_channel: (args) => {
        remove_channel_args = args;
        return Promise.resolve();
    },
}

const forceUpdate = jest.fn(() => {
    parent_updated = true;
});

test('plot_channel_properties', async () => {

    render(
        <ThemeProvider theme={ColorTheme}>
            <PlotChannelProperties application={mock_application} forceUpdate={forceUpdate} channel={mock_application.channels['0']}/>
        </ThemeProvider>
    )
    // Check that the edit view is closed and open it
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument()
    fireEvent.click(screen.getByLabelText("CaretDown"));

    await test_text_field("Name", [mock_application.channels[0].name, "name", "test_change"]);

    //clean up after first test;
    cleanup();

    await test_checkbox("Enabled by default", [mock_application.channels[0].name, "enabled", false]);


    fireEvent.click(screen.getByText("Remove"));
    await remove_channel();

    // test closing editing view
    fireEvent.click(screen.getByLabelText("CaretUp"));
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument()
})

let cleanup = ()=>{
    parent_updated = false;
    edit_channel_args = [];
    forceUpdate.mockClear();
}

async function test_text_field(label, expected_edit) {
    let field = screen.getByLabelText(label);
    fireEvent.change(field, {target: {value: 'test_change'}});
    fireEvent.keyDown(field, {key: 'Enter', code: 'Enter', charCode: 13})
    expect(edit_channel_args).toStrictEqual(expected_edit);
    await waitFor(() => expect(forceUpdate).toHaveBeenCalledTimes(1));
    expect(parent_updated).toBeTruthy();
}


async function test_checkbox(label, expected_edit) {
    let field = screen.getByLabelText(label);
    fireEvent.click(field);
    expect(edit_channel_args).toStrictEqual(expected_edit);
    await waitFor(() => expect(forceUpdate).toHaveBeenCalledTimes(1));
    expect(parent_updated).toBeTruthy();
}



async function remove_channel() {
    expect(remove_channel_args).toBe(mock_application.channels[0].name);
    await waitFor(() => expect(forceUpdate).toHaveBeenCalledTimes(1));
    expect(parent_updated).toBeTruthy();

}
