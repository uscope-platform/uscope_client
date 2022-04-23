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

import { rest } from 'msw'

export let bulk_write_data_check= null;
export let set_register_data = null;
export let peripheral_image = null;
export let created_peripheral = null;
export let edit_peripheral_data = null;
export let remove_peripheral_data = null;

export const peripherals_api = [
    rest.get('/test_server/registers/:periph_name/descriptions', (req, res, ctx) => {
        return res(
            ctx.json({
                peripheral_name: req.params.periph_name,
                registers: {
                    "reg_1": [7594],
                    "reg_2": [8810]
                }
            }),
            ctx.status(200)
        )
    }),

    rest.post('/test_server/registers/:periph_name/value', (req, res, ctx) => {
        set_register_data = {name:req.params.periph_name, body:req.body};
        return res(
            ctx.status(200)
        )
    }),

    rest.post('/test_server/registers/bulk_write', (req, res, ctx) => {
        bulk_write_data_check = req.body;
        return res(
            ctx.status(200)
        )
    }),

    rest.post('/test_server/tab_creator/diagram', (req, res, ctx) => {
        peripheral_image = req.body;
        return res(
            ctx.status(200)
        )
    }),

    rest.post('/test_server/tab_creator/create_peripheral', (req, res, ctx) => {
        created_peripheral = req.body;
        return res(
            ctx.status(200)
        )
    }),

    rest.post('/test_server/tab_creator/edit_peripheral', (req, res, ctx) => {
        edit_peripheral_data = req.body;
        return res(
            ctx.status(200)
        )
    }),

    rest.get('/test_server/tab_creator/remove_peripheral/:periph_name', (req, res, ctx) => {
        remove_peripheral_data = req.params.periph_name;
        return res(
            ctx.status(200)
        )
    })
]
