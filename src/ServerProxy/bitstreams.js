// Copyright 2021 University of Nottingham Ningbo China
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

import axios from "axios"
import store from "../store";
import {addBitstream, editBitstream, loadAllBitstreams, removeBitstream} from "../redux/Actions/bitstreamsActions"

let BitstreamsProxy = class{

    upload_bitstream = (bitstream) => {
        let state = store.getState();
        store.dispatch(addBitstream(state.settings.server_url+'bitstream/'+bitstream.id, bitstream, state.settings.auth_config));
    };

    edit_bitstream = (bitstream) => {
        let state = store.getState();
        store.dispatch(editBitstream(state.settings.server_url+'bitstream/'+bitstream.id, bitstream, state.settings.auth_config));
    };

    load_all = () =>{
        let state = store.getState();
        store.dispatch(loadAllBitstreams(state.settings.server_url+'bitstream/none', state.settings.auth_config));
    };

    get_hash = () =>{
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'bitstream/hash', state.settings.auth_config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    delete_bitstream = (bitstream) => {
        let state = store.getState();
        store.dispatch(removeBitstream(state.settings.server_url+'bitstream/'+bitstream.id, bitstream, state.settings.auth_config));
    };

}

export default BitstreamsProxy;
