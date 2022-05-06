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


export class up_register {
    constructor(register_obj) {
        this.ID = register_obj.ID;
        this.register_name = register_obj.register_name;
        this.description = register_obj.description;
        this.direction = register_obj.direction;
        this.offset= register_obj.offset;
        this.register_format= register_obj.register_format;
        this.value = register_obj.value;
    }

    static construct_empty(register_name){
        let register_obj = {ID:register_name.replace(/\s/g, "_").toLowerCase(), register_name:register_name,
            description:"", direction:"", offset:"0x0", register_format:"single", value:0};
        return new up_register(register_obj);
    }

    set_id = (id) =>{
        this.ID = id
    }

    set_name = (name) =>{
        this.register_name = name;
    };

    set_description = (descr) => {
        this.description = descr;
    }

    set_direction = (dir) => {
        this.direction = dir
    }

    set_offset = (offset) => {
        this.offset = offset;
    }

    set_format = (format) => {
        this.register_format = format;
    }

}
