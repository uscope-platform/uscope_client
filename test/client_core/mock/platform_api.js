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

export let add_user_data = null;
export let remove_user_data = null;
export let do_onboarding_data = null;
export let database_restore_data = null;

export const platform_api = [

    rest.get('/test_server/auth/user', (req, res, ctx) => {
        return res(
            ctx.json({username: "test", role: "admin"}),
            ctx.status(200)
        )
    }),

    rest.post('/test_server/auth/user', (req, res, ctx) => {
        add_user_data = req.body;
        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    }),

    rest.delete('/test_server/auth/user', (req, res, ctx) => {
        remove_user_data = req.body;
        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    }),

    rest.get('/test_server/auth/onboarding', (req, res, ctx) => {
        return res(
            ctx.json({onboarding_needed:true}),
            ctx.status(200)
        )
    }),

    rest.post('/test_server/auth/onboarding', (req, res, ctx) => {
        do_onboarding_data = req.body;
        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    }),
    rest.get('/test_server/database/export', (req, res, ctx) => {
        return res(
            ctx.json({database_export:true}),
            ctx.status(200)
        )
    }),

    rest.post('/test_server/database/import', (req, res, ctx) => {
        database_restore_data = req.body;
        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    }),
]