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


export class up_field {
    constructor(field_obj) {
        this.name = field_obj.name;
        this.description = field_obj.description;
        this.length = field_obj.length;
        this.offset = field_obj.offset;
    }

    static construct_empty(field_name){
        let field_obj = {name:field_name, description:"", length:1,  offset:0};
        return new up_field(field_obj);
    }

    set_name = (name) =>{
        this.name = name
    }

    set_description = (description) =>{
        this.description = description;
    };

    set_length = (length) => {
        this.length = length
    }

    set_offset = (offset) => {
        this.offset = offset;
    }

    _get_field = () => {
        return{
            "name": this.name,
            "description": this.description,
            "length": this.length,
            "offset": this.offset
        }
    }
}
