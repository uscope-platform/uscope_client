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

import {store} from "../index";
import {backend_delete, backend_patch, backend_post} from "../proxy/backend";
import {api_dictionary} from "../proxy/api_dictionary";
import {AddBitstream, removeBitstream} from "../../redux/Actions/bitstreamsActions";

export class up_bitstream {
    constructor(bitstream_obj) {
        if(!bitstream_obj)
            return;
        this.id = bitstream_obj.id;
        this.name = bitstream_obj.name;
        this.content = bitstream_obj.content;

    }

    static construct_empty(bitstream_id){
        let script_obj = {id:bitstream_id, name:'new_bitstream_'+bitstream_id, content:null};
        return new up_bitstream(script_obj);
    }

    add_remote = () => {
        store.dispatch(AddBitstream(this));
        return backend_post(api_dictionary.bitstream.add+'/'+this.id, this._get_bitstream());
    }

    edit_field = (field, value) => {
        if(field !== "content")
            this[field] = value;
        store.dispatch(AddBitstream(this));
        let edit = {id:this.id , field:{name:field, value:value}};
        return backend_patch(api_dictionary.bitstream.edit+'/'+this.id,edit)
    }

    static delete_bitstream(bitstream){
        return backend_delete(api_dictionary.bitstream.delete+'/'+bitstream.id, bitstream).then(()=>{
            store.dispatch(removeBitstream(bitstream));
        })
    }

    static get_file_content(input_file){
        return new Promise((resolve, reject) => {
            let file = input_file.current.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = function (evt) {
                    let result = {'content':reader.result.split(',')[1], name:file.name}
                    resolve(result)
                }
                reader.readAsDataURL(file);
            }
        })
    }

    _get_bitstream = () =>{
        return {
            id: this.id,
            name: this.name,
            content: this.content
        };
    }


}
