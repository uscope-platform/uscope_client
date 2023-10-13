// Copyright 2023 Filippo Savi
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
import {AddEmulator, removeEmulator} from "../../redux/Actions/EmulatorActions";

export class up_emulator {
    constructor(emulator_obj) {
        if(!emulator_obj)
            return;
        this.id = emulator_obj.id;
        this.name = emulator_obj.name;
        this.cores = emulator_obj.cores;
        this.connections = emulator_obj.connections;
        this.inputs = emulator_obj.inputs;
        this.outputs= emulator_obj.outputs;
    }

    static construct_empty(emulator_id){
        let emulator_obj = {
            id:emulator_id,
            name:'new_emulator_'+ emulator_id,
            cores:{},
            connections:{},
            inputs:{},
            outputs:{}
        };
        return new up_emulator(emulator_obj);
    }

    add_remote = () => {
        store.dispatch(AddEmulator(this));
        return backend_post(api_dictionary.emulators.add+'/'+this.id, this._get_emulator());
    }

    edit_field = (field, value) => {
        this[field] = value;
        store.dispatch(AddEmulator(this));
        let edit = {filter:this.id, field:field, value:value};
        return backend_patch(api_dictionary.emulators.edit+'/'+this.id,edit)
    }

    static delete(emulator){
        return backend_delete(api_dictionary.emulators.delete+'/'+emulator.id, emulator).then(()=>{
            store.dispatch(removeEmulator(emulator));
        })
    }

    _get_emulator = () =>{
        return {
            id: this.id,
            name: this.name,
            cores: this.cores,
            connections: this.connections,
            inputs: this.connections,
            outputs: this.outputs
        };
    }


}
