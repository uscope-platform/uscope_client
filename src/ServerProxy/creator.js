//import store from "../store";

import axios from "axios";
import store from "../store";
import {addPeripheral, editPeripheral, removePeripheral} from "../redux/Actions/peripheralsActions";

let CreatorProxy = class  {

    createPeripheral = (peripheral, image) => {
        if(image!==null){
            let formData = new FormData();
            formData.append("file", image, image.name);

            let state = store.getState();
            debugger;
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
