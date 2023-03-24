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

export let created_app_data = null;
export let removed_app = null;
export let edit_app_data = null;

export const applications_api = [

    rest.post('test_server/application/add', (req, res, ctx) => {
        created_app_data = req.body
        return res(
            ctx.status(200)
        )
    }),

    rest.get('test_server/application/remove/:app_name',(req, res, ctx) =>{
        removed_app = req.params.app_name;
        return res(
            ctx.status(200)
        )
    }),

    rest.post('test_server/application/edit', (req, res, ctx) => {
        edit_app_data = req.body
        return res(
            ctx.status(200)
        )
    })

]