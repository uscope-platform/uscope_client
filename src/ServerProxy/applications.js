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
import {setChannelSetting} from "../redux/Actions/plotActions";
import {
    addApplication,
    editApplication,
    loadApplications,
    removeApplication
} from "../redux/Actions/applicationActions";

 let ApplicationProxy = class {

     load_all = () =>{
         let state = store.getState();
         store.dispatch(loadApplications(state.settings.server_url+'application/all/specs', state.settings.auth_config))
     };

     setApplication = (app_name) => {
         return new Promise( (resolve, reject) => {
             let state = store.getState();
             axios.get(state.settings.server_url+'application/set/'+app_name, state.settings.auth_config)
                 .then(res => {
                     resolve(res.data);
                 }).catch(error => {
                 reject(error);
             });
         });
     };

     setChannelLimits = (min_val, max_val, id) =>{
         let state = store.getState();
         let message = [{name:'min_value', channel_id:id, value:min_val},{name:'min_value', channel_id:id, value:min_val}];
         store.dispatch(setChannelSetting(state.settings.server_url+'plot/channels/params', message, state.settings.auth_config));
     };

     get_hash = () =>{
         return new Promise( (resolve, reject) => {
             let state = store.getState();
             axios.get(state.settings.server_url+'application/digest', state.settings.auth_config)
                 .then(res => {
                     resolve(res.data);
                 })
         });
     };

     createApplication = (application_obj) => {
         let state = store.getState();
         return new Promise((resolve, reject) => {
             store.dispatch(addApplication(state.settings.server_url+'application/add', application_obj, state.settings.auth_config)).then(data =>{
                 resolve(data);
             })
         });
     };

     edit_application = (edit) => {
         let state = store.getState();
         store.dispatch(editApplication(state.settings.server_url + 'application/edit',edit,state.settings.auth_config))
     };

     removeApplication = (application) =>{
         let state = store.getState();
         store.dispatch(removeApplication(state.settings.server_url+'application/remove/'+application, application, state.settings.auth_config));
     };
 };



export default ApplicationProxy;


