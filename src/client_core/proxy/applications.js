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


import {backend_get, dispatch_redux_thunk} from "./backend";
import {
    addApplication,
    editApplication,
    loadApplicationsDone,
    removeApplication
} from "../../redux/Actions/applicationActions";
import {api_dictionary} from './api_dictionary'
import {up_application} from "../data_models/up_application";
import {store} from "../index";

export const get_applications_hash = () =>{
    return backend_get(api_dictionary.applications.get_hash)
};

export const load_all_applications = () => {
    return backend_get(api_dictionary.applications.load_all).then(res=>{
        let apps_dict = {}
        for (let item in res) {
            let app = new up_application(res[item])
            apps_dict[app.application_name] = app
        }
        store.dispatch(loadApplicationsDone(apps_dict));
        return apps_dict;
    })

}

export const create_application = (application) => {
    return dispatch_redux_thunk(addApplication, api_dictionary.applications.add, application);
}

export const edit_application = (edit) => {
    return dispatch_redux_thunk(editApplication, api_dictionary.applications.edit, edit);
}

export const remove_application = (application) => {
    return dispatch_redux_thunk(removeApplication, api_dictionary.applications.remove+'/'+application, application);
}

export const set_application = (application_name) => {
    return backend_get(api_dictionary.applications.set + '/' + application_name);
}
