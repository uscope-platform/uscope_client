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

import {rest} from 'msw'

export let bitstream_creation_data = null;
export let bitstream_removal_data = null;
export let edit_bitstream_data = null;

export const bitstreams_api = [

    rest.post('/test_server/bitstream/:bitstream_id', (req, res, ctx) => {
        bitstream_creation_data = {id:req.params.bitstream_id, body:req.body};
        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    }),

    rest.patch('/test_server/bitstream/:bitstream_id',(req, res, ctx) =>{
        edit_bitstream_data = {id:req.params.bitstream_id, body:req.body};

        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    }),

    rest.delete('/test_server/bitstream/:bitstream_id', (req, res, ctx) => {
        bitstream_removal_data =  req.params.bitstream_id;
        return res(
            ctx.text("ok"),
            ctx.status(200)
        )
    })

]