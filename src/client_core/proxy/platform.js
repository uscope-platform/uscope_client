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

import {backend_delete, backend_get, backend_post} from "./backend";


export const add_user = user =>{
    return backend_post('auth/user', user);
}

export const remove_user = user =>{
    return backend_delete('auth/user', user);
}

export const need_onboarding = () =>{
    return backend_get("auth/onboarding");
}

export const  do_onboarding = user =>{
    return backend_post('auth/onboarding', user);
}

export const get_users_list = () =>{
    return backend_get("auth/user");
}

export const dump_database = () =>{
    return backend_get('database/export');
}

export const restore_database = db_file =>{
    return backend_post('database/import', db_file);
}
