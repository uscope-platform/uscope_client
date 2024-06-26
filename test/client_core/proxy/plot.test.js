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

import {
    create_plot_channel,
    get_channel_number_from_id,
    get_channels_from_group,
    set_channel_status,
} from "../../../src/client_core";
import {set_channel_status_data, setup_widths_data} from "../mock/plot_api";

test("create_plot_channel", () => {
    let input = {
        name: "test",
        id: "test".replace(/\s/g, "_").toLowerCase(),
        number: 0,
        mux_setting: 0,
        enabled: false,
    }
    let ret_val = create_plot_channel(input);
    let expected_ret = {
        x: Array.from(Array(1024).keys()),
        y: Array(1024).fill(0),
        type: 'scatter',
        mode: 'lines',
        name: "test",
        visible: false,
        spec: input
    };
    expect(ret_val).toStrictEqual(expected_ret)
})


test("get channels from group", () => {
    let group = {
        group_name: "test group",
        group_id: "test group".replace(/\s/g, "_").toLowerCase(),
        channels:[
            {
                label: "Reference A",
                value: "reference_a"
            },
            {
                label: "Reference B",
                value: "reference_b"
            }
        ],
        default:false
    }

    let channels = [
        {
            enabled: true,
            id: "reference_a",
            mux_setting: "1",
            name: "Reference A",
            number: 0,
        },
        {
            enabled: true,
            id: "reference_b",
            mux_setting: "1",
            name: "Reference B",
            number: 0,
        },
        {
            enabled: true,
            id: "reference_c",
            mux_setting: "1",
            name: "Reference C",
            number: 0,
        }
    ];
    let res = get_channels_from_group(group, channels);
    let check_array = [
        {
            enabled: true,
            id: "reference_a",
            mux_setting: "1",
            name: "Reference A",
            number: 0,
        },
        {
            enabled: true,
            id: "reference_b",
            mux_setting: "1",
            name: "Reference B",
            number: 0,
        }
    ];
    expect(res).toStrictEqual(check_array);
})


test("get channel number from id", () => {
    let channels = [
        create_plot_channel({
            name: "test",
            id: "test",
            number: 0,
            mux_setting: 0,
            enabled: false
        }),
        create_plot_channel({
            name: "test_2",
            id: "test_2",
            number: 1,
            mux_setting: 0,
            enabled: false
        }),
    ]

    let res = get_channel_number_from_id("test_2", channels);
    expect(res).toStrictEqual(1);
})



test("set channel state", () => {
    let status = [
        {
            "0": false,
            "1": true,
            "2": true,
            "3": true,
            "4": true,
            "5": true
        }
    ]

    return set_channel_status(status).then((res) =>{
        expect(status).toStrictEqual(set_channel_status_data);
    });

})


