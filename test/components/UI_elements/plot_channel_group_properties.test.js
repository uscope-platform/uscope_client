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

import {ColorTheme, PlotChannelGroupProperties} from "../../../src/components/UI_elements";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import selectEvent from 'react-select-event'
import '@testing-library/jest-dom/extend-expect'

let parent_updated = false;

let edit_channel_args = [];
let remove_channel_args = "";


let mock_application = {
    channels: [
        {
            id: 2,
            name: 'Current B',
        },
        {
            id: 1,
            name: 'Current A',
        },
        {
            id: 3,
            name: 'Current C',
        },
        ],
    channel_groups:{
        '0': {
            channels: [
                {
                    label: 'Current A',
                    value: 1
                }
            ],
            'default': false,
            group_id: 'raw_currents',
            group_name: 'Raw Currents'
        },
    },


    edit_channel_group: (a1, a2, a3) => {
        edit_channel_args.push(a1);
        edit_channel_args.push(a2);
        edit_channel_args.push(a3);
        return Promise.resolve();
    },
    remove_channel_groups: (args) => {
        remove_channel_args = args;
        return Promise.resolve();
    },
}

const forceUpdate = jest.fn(() => {
    parent_updated = true;
});

test('plot_channel_group_properties', async () => {

    render(
        <ThemeProvider theme={ColorTheme}>
            <PlotChannelGroupProperties application={mock_application} forceUpdate={forceUpdate} group={mock_application.channel_groups['0']}/>
        </ThemeProvider>
    )
    // Check that the edit view is closed and open it
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument()
    fireEvent.click(screen.getByLabelText("CaretDown"));

    await test_text_field("Name", [mock_application.channel_groups['0'].group_name, "group_name", "test_change"]);

    cleanup();

    await test_checkbox("Default group", [mock_application.channel_groups['0'].group_name, "default", true]);

    fireEvent.click(screen.getByText("Remove"));
    await remove_channel_group();

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


async function remove_channel_group() {
    expect(remove_channel_args).toBe(mock_application.channel_groups['0'].group_name);
    await waitFor(() => expect(forceUpdate).toHaveBeenCalledTimes(1));
    expect(parent_updated).toBeTruthy();

}
