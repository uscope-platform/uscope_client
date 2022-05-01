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


import {backend_get, backend_post} from "./backend";
import {
    addApplication,
    loadApplications,
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
        store.dispatch(loadApplications(apps_dict));
        return apps_dict;
    })

}

export const create_application = (application) => {
    let app_obj = application._get_app();
    return backend_post(api_dictionary.applications.add, app_obj).then(()=>{
        store.dispatch(addApplication({[application.application_name]:application}));
    });
}

export const remove_application = (application) => {
    return backend_get(api_dictionary.applications.remove+'/'+application).then(()=>{
        store.dispatch(removeApplication(application));
    })
}

export const set_application = (application_name) => {
    return backend_get(api_dictionary.applications.set + '/' + application_name);
}
