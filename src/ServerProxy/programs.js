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
import {addProgram, editProgram, removeProgram} from "../redux/Actions/ProgramsActions";

let ProgramsProxy = class{

    upload_program =  (program) => {
        let state = store.getState();
        store.dispatch(addProgram(state.settings.server_url+'program/'+program.id, program, state.settings.auth_config));
    };

    edit_program =  (program) => {
        let state = store.getState();
        store.dispatch(editProgram(state.settings.server_url+'program/'+program.id, program, state.settings.auth_config));
    };

    delete_program = (program) => {
        let state = store.getState();
        store.dispatch(removeProgram(state.settings.server_url+'program/'+program.id, program, state.settings.auth_config));
    };

    compile_program = (program) =>{
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'program/compile/'+program.id, state.settings.auth_config)
                .then(res =>{
                    resolve(res.data);
                })
        })
    };

    apply_program = (program) => {
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.post(state.settings.server_url+'program/Apply/'+program.id, program, state.settings.auth_config).then(res => {
                resolve(res.data);
            }).catch(err => {
                alert('ERROR: error while loading a program on the core' + err.message);
            });
        })
    }
}

export default ProgramsProxy;
