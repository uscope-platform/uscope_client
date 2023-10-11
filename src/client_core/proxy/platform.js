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

import {api_dictionary} from './api_dictionary'

export const add_user = user =>{
    return backend_post(api_dictionary.platform.users.add, user);
}

export const remove_user = user =>{
    return backend_delete(api_dictionary.platform.users.delete, user);
}

export const need_onboarding = () =>{
    return backend_get(api_dictionary.platform.users.need_onboarding);
}

export const  do_onboarding = user =>{
    return backend_post(api_dictionary.platform.users.do_onboarding, user);
}

export const get_users_list = () =>{
    return backend_get(api_dictionary.platform.users.get_list);
}

export const dump_database = () =>{
    return backend_get(api_dictionary.platform.db.dump);
}

export const restore_database = db_file =>{
    return backend_post(api_dictionary.platform.db.restore, db_file);
}

export const get_version = component =>{
    let address = api_dictionary.platform.db.versions + "/" + component;
    return backend_get(address);
}