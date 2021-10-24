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

import axios from "axios";
import store from "../store";
import {addPeripheral, editPeripheral, removePeripheral} from "../redux/Actions/peripheralsActions";

let CreatorProxy = class  {

    createPeripheral = (peripheral, image) => {
        if(image!==null){
            let formData = new FormData();
            formData.append("file", image, image.name);

            let state = store.getState();
            let local_headers = {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            };

            axios.post(state.settings.server_url+'tab_creator/diagram',
                formData,
                {
                    headers:{
                        ...local_headers,
                        ...state.settings.auth_config.headers
                    }
                }
            ).then(() =>{
                let state = store.getState();
                store.dispatch(addPeripheral(state.settings.server_url+'tab_creator/create_peripheral',{payload:peripheral, image:true}, state.settings.auth_config))
            }).catch((response) => {
                //handle error
                console.log(response);
            });
        } else{
            let state = store.getState();
            store.dispatch(addPeripheral(state.settings.server_url+'tab_creator/create_peripheral',{payload:peripheral, image:false}, state.settings.auth_config))
        }

    };

    send_image = (image)=>{
        let formData = new FormData();
        formData.append("file", image, image.name);

        let state = store.getState();
        let local_headers = {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
        };

        axios.post(state.settings.server_url+'tab_creator/diagram',
            formData,
            {
                headers:{
                    ...local_headers,
                    ...state.settings.auth_config.headers
                }
            }
        ).then(() =>{})
    }

    edit_peripheral = (edit) => {

        let state = store.getState();
        store.dispatch(editPeripheral(state.settings.server_url+'tab_creator/edit_peripheral', edit, state.settings.auth_config));
    };

    removePeripheral = (peripheral) => {

        let state = store.getState();
        store.dispatch(removePeripheral(state.settings.server_url+'tab_creator/remove_peripheral/'+ peripheral, peripheral, state.settings.auth_config))
    };

}

export default CreatorProxy;
