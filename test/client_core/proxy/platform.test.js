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

import {
    add_user,
    do_onboarding,
    dump_database,
    get_users_list,
    need_onboarding,
    remove_user, restore_database
} from "../../../src/client_core";
import {add_user_data, database_restore_data, do_onboarding_data, remove_user_data} from "../mock/platform_api";


test("add user", () => {

    let user_obj = {
        "user": "user",
        "password": "test",
        "role": "admin"
    }
    return add_user(user_obj).then((res) =>{
        expect(add_user_data).toStrictEqual( user_obj);
    })
})

test("remove user", () => {

    let user_obj = {user: "user"}
    return remove_user(user_obj).then((res) =>{
        expect(remove_user_data).toStrictEqual( user_obj);
    })
})

test("need onboarding", () => {

    return need_onboarding().then((res) =>{
        expect(res['onboarding_needed']).toBe( true);
    })
})

test("do onboarding", () => {
    let user_obj = {
        "user": "user",
        "password": "test",
        "role": "admin"
    }
    return do_onboarding(user_obj).then((res) =>{
        expect(do_onboarding_data).toStrictEqual( user_obj);
    })
})


test("get users list", () => {

    return get_users_list().then((res) =>{
        expect(res).toStrictEqual( {username: "test", role: "admin"});
    })
})


test("export database", () => {

    return dump_database().then((res) =>{
        expect(res).toStrictEqual( {database_export:true});
    })
})


test("restore database", () => {
    let db = {database_import:true};
    return restore_database(db).then((res) =>{
        expect(db).toStrictEqual( database_restore_data);
    })
})