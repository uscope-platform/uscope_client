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

export let setup_widths_data = undefined;
export let set_channel_status_data = undefined;

export const plot_api = [
    rest.post('/test_server/plot/channels/widths', (req, res, ctx) => {
        setup_widths_data = req.body;
        if(req.body.widths.length===0)
            return res(
                ctx.status(500)
            )
        else
            return res(
                ctx.status(200)
            )
    }),
    rest.post('/test_server/plot/channels/status', (req, res, ctx) => {
        set_channel_status_data = req.body;
        return res(
            ctx.status(200)
        )
    })
]
