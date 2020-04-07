//import store from "../store";

import axios from "axios";
import store from "../store";
import {removePeripheral} from "../redux/Actions/peripheralsActions";

export default function creatorProxy(server_url, token) {
    this.server_url = server_url;
    this.config = {headers: { Authorization: `Bearer ${token}` }};

    this.createPeripheral = (peripheral, image) => {
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
                        'Authorization': `Bearer ${token}`
                    }}
            ).then(() =>{
                axios.post(this.server_url+'tab_creator/create_peripheral',{payload:peripheral, image:true}, this.config).catch(err => {
                    alert(err.message);
                })
            }).catch(function (response) {
                //handle error
                console.log(response);
            });
        } else{
            axios.post(this.server_url+'tab_creator/create_peripheral',{payload:peripheral, image:false},this.config).catch(err => {
                alert(err.message);
            })
        }

    };

    this.removePeripheral = (peripheral) => {
        store.dispatch(removePeripheral(this.server_url+'tab_creator/remove_peripheral/'+ peripheral, peripheral, this.config))
    };

}
