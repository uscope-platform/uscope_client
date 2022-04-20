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


export const handlers = [

    rest.get('application/digest', (req, res, ctx) => {

        // If authenticated, return a mocked user details
        return res(
            ctx.status(200),
            ctx.text("9bcb1e2d-dc4c-44cb-be5d-3897f288c617"),
        )
    }),


    rest.get('registers/digest', (req, res, ctx) => {

        // If authenticated, return a mocked user details
        return res(
            ctx.status(200),
            ctx.text("94c46594-3bb9-4fae-b6aa-a61e03a288e2"),
        )
    }),

    rest.get('script/hash', (req, res, ctx) => {

        // If authenticated, return a mocked user details
        return res(
            ctx.status(200),
            ctx.text("9701008d-c511-4ded-94b3-b08748a6e066"),
        )
    }),

    rest.get('program/hash', (req, res, ctx) => {

        // If authenticated, return a mocked user details
        return res(
            ctx.status(200),
            ctx.text("d0f84519-10da-4ada-8727-8bd6a0f608e0"),
        )
    }),

    rest.get('bitstream/digest', (req, res, ctx) => {

        // If authenticated, return a mocked user details
        return res(
            ctx.status(200),
            ctx.text("74478cc1-fdb7-486a-975c-129c71400530"),
        )
    }),


]