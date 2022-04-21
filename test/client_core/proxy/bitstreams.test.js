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


import {upload_bitstream,edit_bitstream, delete_bitstream} from "../../../src/client_core";
import {mock_store} from "../mock/redux_store";
import {bitstream_creation_data, edit_bitstream_data, bitstream_removal_data} from "../mock/bitstreams_api";

test("bitstream_addition", () => {

    let bitstream_obj = {
        "id": 2,
        "name": "test.bin",
        "content": "dGVzdF9iaXRzdHJlYW0K"
    }
    return upload_bitstream(bitstream_obj).then((res) =>{
        let state = mock_store.getState();
        expect(state.bitstreams[2]).toStrictEqual(bitstream_obj);
        let check_data = {
            id: '2',
            body: { id: 2, name: 'test.bin', content: 'dGVzdF9iaXRzdHJlYW0K' }
        }
        expect(bitstream_creation_data).toStrictEqual( check_data);

    })
})


test("bitstream_deletion", () => {
    let bitstream_obj = {
        "id": 1,
        "name": "test"
    }
    return delete_bitstream(bitstream_obj).then((res) =>{
        let state = mock_store.getState();
        expect(state.bitstreams).not.toHaveProperty("1");
        expect(bitstream_removal_data).toBe("1");
    })
})


test("bitstream_edit", () => {

    let  edit = {id:1, field:{name:"name", value:"edited_test"}}
    return edit_bitstream(edit).then(()=>{
        let state = mock_store.getState();
        let check_bitstream_obj = {
            "id": 1,
            "name": "edited_test"
        }
        expect(state.bitstreams[1]).toStrictEqual(check_bitstream_obj);
        expect(edit_bitstream_data).toStrictEqual(edit);
    })
})




