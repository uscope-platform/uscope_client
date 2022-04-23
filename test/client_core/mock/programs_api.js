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

export let created_program_data = null;
export let removed_program_data = null;
export let edit_program_data = null;
export let applied_program_data = null;
export let compile_program_data = null;

export const programs_api = [

    rest.post('/test_server/program/:program_id', (req, res, ctx) => {
        created_program_data = {id:req.params.program_id, body:req.body};
        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    }),

    rest.patch('/test_server/program/:program_id',(req, res, ctx) =>{
        edit_program_data = {id:req.params.program_id, body:req.body};
        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    }),

    rest.delete('/test_server/program/:program_id', (req, res, ctx) => {
        removed_program_data =  req.params.program_id;
        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    }),

    rest.post('/test_server/program/Apply/:program_id', (req, res, ctx) => {
        applied_program_data = {id:req.params.program_id, body:req.body};
        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    }),
    rest.get('/test_server/program/compile/:program_id', (req, res, ctx) => {
        compile_program_data = req.params.program_id
        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    })
]