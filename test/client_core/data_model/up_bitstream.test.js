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

import {mock_store} from "../mock/redux_store";
import {up_bitstream} from "../../../src/client_core";
import {bitstream_creation_data, bitstream_removal_data, edit_bitstream_data} from "../mock/bitstreams_api";

test("bitstream creation", () => {
    let bitstream = up_bitstream.construct_empty(1);
    let check_bitstream = {
            id:1,
            name:"new_bitstream_1",
            content:null
        };

    expect(bitstream._get_bitstream()).toStrictEqual(check_bitstream)
})

test("remote add", () => {
    let bitstream = up_bitstream.construct_empty(1);
    return bitstream.add_remote().then(()=>{
        let check_bitstream =  {
            body:{
                id:1,
                name:"new_bitstream_1",
                content:null
            },
            id:"1"
        };

        expect(bitstream_creation_data).toStrictEqual(check_bitstream);
        let state = mock_store.getState();
        expect(state.bitstreams[1]._get_bitstream()).toStrictEqual(check_bitstream.body)
    })
})


test("edit bitstream", () => {
    let bitstream = up_bitstream.construct_empty(1);
    return bitstream.add_remote().then(()=>{
        return bitstream.edit_field("name","TEST name").then(()=>{
            let check_bitstream = {
                id:1,
                name:"TEST name",
                content:null
            };

            expect(edit_bitstream_data).toStrictEqual({id:"1", body:{id:1 , field:{name:"name", value:"TEST name"}}});
            let state = mock_store.getState();
            expect(state.bitstreams[1]._get_bitstream()).toStrictEqual(check_bitstream);
        });


    })
})



test("delete program", () => {
    let bitstream = up_bitstream.construct_empty(10);
    return bitstream.add_remote().then(()=>{
        return up_bitstream.delete_bitstream(bitstream).then(()=>{
            expect(bitstream_removal_data).toStrictEqual(bitstream.id.toString());
            let programs = mock_store.getState().programs;
            expect(programs).not.toHaveProperty(bitstream.id.toString());
        })
    })
})


