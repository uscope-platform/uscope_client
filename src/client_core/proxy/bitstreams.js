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


import {backend_get, dispatch_redux_thunk_get, dispatch_redux_thunk_post} from "./backend";
import {addBitstream, editBitstream, loadAllBitstreams, removeBitstream} from "../../redux/Actions/bitstreamsActions";
import store from "../../store";


export const get_bitstreams_hash = () =>{
    return backend_get('bitstream/digest')
};

export const load_all_bitstreams = () => {
    return dispatch_redux_thunk_get(loadAllBitstreams,'bitstream/none');
}

export const upload_bitstream = (bitstream) => {
    dispatch_redux_thunk_post(addBitstream, 'bitstream/'+bitstream.id, bitstream);
}

export const edit_bitstream = (bitstream) => {
    dispatch_redux_thunk_post(editBitstream, 'bitstream/'+bitstream.id, bitstream);
}

export const delete_bitstream = (bitstream) => {
    dispatch_redux_thunk_post(removeBitstream, 'bitstream/'+bitstream.id, bitstream);
}
