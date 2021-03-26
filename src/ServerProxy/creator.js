//import store from "../store";

import axios from "axios";
import store from "../store";
import {addPeripheral, editPeripheral, removePeripheral} from "../redux/Actions/peripheralsActions";


let creatorProxy = class  {
    constructor(server_url, token) {
        this.server_url = server_url;
        this.token = token
        this.config = {headers: { Authorization: `Bearer ${token}` }};
    }

    createPeripheral = (peripheral, image) => {
        if(image!==null){
            let formData = new FormData();
            formData.append("file", image, image.name);

            axios.post(this.server_url+'tab_creator/diagram',
                formData,
                {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                        'Authorization': `Bearer ${this.token}`
                    }}
            ).then(() =>{
                store.dispatch(addPeripheral(this.server_url+'tab_creator/create_peripheral',{payload:peripheral, image:true}, this.config))
            }).catch((response) => {
                //handle error
                console.log(response);
            });
        } else{
            store.dispatch(addPeripheral(this.server_url+'tab_creator/create_peripheral',{payload:peripheral, image:false}, this.config))
        }

    };

    send_image = (image)=>{
        let formData = new FormData();
        formData.append("file", image, image.name);

        axios.post(this.server_url+'tab_creator/diagram',
            formData,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'Authorization': `Bearer ${this.token}`
                }}
        ).then(() =>{})
    }

    edit_peripheral = (edit) => {
        store.dispatch(editPeripheral(this.server_url+'tab_creator/edit_peripheral', edit, this.config));
    };

    removePeripheral = (peripheral) => {
        store.dispatch(removePeripheral(this.server_url+'tab_creator/remove_peripheral/'+ peripheral, peripheral, this.config))
    };

}

export default creatorProxy;
