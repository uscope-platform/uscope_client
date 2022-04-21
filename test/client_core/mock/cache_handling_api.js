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


export const cache_handlers = [

    rest.get('test_server/application/digest', (req, res, ctx) => {
        // If authenticated, return a mocked user details
        return res(
            ctx.text("9bcb1e2d-dc4c-44cb-be5d-3897f288c617"),
            ctx.status(200)
        )
    }),

    rest.get('test_server/application/all/specs', (req, res, ctx) => {
        // If authenticated, return a mocked user details
        return res(
            ctx.json([{application_obj:true}]),
            ctx.status(200)
        )
    }),


    rest.get('test_server/registers/digest', (req, res, ctx) => {
        // If authenticated, return a mocked user details
        return res(
            ctx.text("94c46594-3bb9-4fae-b6aa-a61e03a288e2"),
            ctx.status(200)
        )
    }),

    rest.get('test_server/registers/all_peripheral/descriptions', (req, res, ctx) => {
        // If authenticated, return a mocked user details
        return res(
            ctx.json([{peripheral_obj:true}]),
            ctx.status(200)
        )
    }),

    rest.get('test_server/script/hash', (req, res, ctx) => {

        // If authenticated, return a mocked user details
        return res(
            ctx.text("9701008d-c511-4ded-94b3-b08748a6e066"),
            ctx.status(200)
        )
    }),

    rest.get('test_server/script/none', (req, res, ctx) => {
        // If authenticated, return a mocked user details
        return res(
            ctx.json([{scripts_obj:true}]),
            ctx.status(200)
        )
    }),


    rest.get('test_server/program/hash', (req, res, ctx) => {
        // If authenticated, return a mocked user details
        return res(
            ctx.text("d0f84519-10da-4ada-8727-8bd6a0f608e0"),
            ctx.status(200)
        )
    }),

    rest.get('test_server/program/none', (req, res, ctx) => {
        // If authenticated, return a mocked user details
        return res(
            ctx.json([{programs_obj:true}]),
            ctx.status(200)
        )
    }),

    rest.get('test_server/bitstream/digest', (req, res, ctx) => {
        // If authenticated, return a mocked user details
        return res(
            ctx.text("74478cc1-fdb7-486a-975c-129c71400530"),
            ctx.status(200)
        )
    }),

    rest.get('test_server/bitstream/none', (req, res, ctx) => {
        // If authenticated, return a mocked user details
        return res(
            ctx.json([{bitstream_obj:true}]),
            ctx.status(200)

        )
    }),
]