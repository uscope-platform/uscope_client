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


import {backend_get, backend_post, dispatch_redux_thunk} from "./backend";
import {addProgram, editProgram, loadAllPrograms, removeProgram} from "../../redux/Actions/ProgramsActions";

import {api_dictionary} from './api_dictionary'

export const get_programs_hash = () =>{
    return backend_get(api_dictionary.programs.get_hash)
};

export const load_all_programs = () => {
    return dispatch_redux_thunk(loadAllPrograms,api_dictionary.programs.load_all);
}

export const upload_program =  (program) => {
    return dispatch_redux_thunk(addProgram, api_dictionary.programs.add+'/'+program.id, program)
};

export const edit_program =  (program) => {
    return dispatch_redux_thunk(editProgram, api_dictionary.programs.edit+'/'+program.program, program)
};

export const delete_program = (program) => {
    return dispatch_redux_thunk(removeProgram, api_dictionary.programs.delete+'/'+program.id, program)
};

export const compile_program = (program) =>{
    return backend_get(api_dictionary.programs.compile+'/'+program.id)
};

export const apply_program = (program) => {
    return backend_post(api_dictionary.programs.apply+'/'+program.id, program).then((res)=>{
        return res;
    }).catch((err)=>{
        alert('ERROR: error while loading a program on the core' + err.message);
        return err;
    })
}