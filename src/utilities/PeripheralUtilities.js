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

export let create_peripheral_obj = (name) => {
    //The peripheral image path is set directly by the server, as doing anything else would create unnecessary coupling
    return{
        [name]: {
            peripheral_name: name,
            version: 0.1,
            registers: []
        }
    };
}

export let create_register = (name, type) =>{
    return {
        ID: name.replace(/\s/g, "_").toLowerCase(),
        register_name: name,
        description: "",
        direction: "",
        field_descriptions: [],
        field_names: [],
        offset: "0x0",
        register_format: type
    }
}




