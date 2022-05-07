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

import {rest} from "msw";

let channel_info = [
    {
        "enabled": true,
        "id": 2,
        "max_value": 180,
        "min_value": 0,
        "mux_setting": "0",
        "name": "Current B",
        "number": "1",
        "phys_width": "14"
    },
    {
        "enabled": true,
        "id": "reference_a",
        "max_value": "1000",
        "min_value": "0",
        "mux_setting": "1",
        "name": "Reference A",
        "number": 0,
        "phys_width": "14"
    }
]


export const plot_api = [


    rest.get('/test_server/plot/channels/specs', (req, res, ctx) => {
        return res(
            ctx.json({data:channel_info}),
            ctx.status(200)
        )
    })
]
