//import store from "../store";

import axios from "axios";
import store from "../store";
import {removePeripheral} from "../redux/Actions/peripheralsActions";

export default function creatorProxy(server_url) {
    this.server_url = server_url;

    this.createPeripheral = (app, image) => {
        debugger;
        let formData = new FormData();
        formData.append("file", image, image.name);

        axios.post(this.server_url+'tab_creator/diagram',
            formData,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                }}
        ).then(() =>{
                axios.post(this.server_url+'tab_creator/create_peripheral',{payload:app}).catch(err => {
                    alert(err.message);
                })
        }).catch(function (response) {
            //handle error
            console.log(response);
        });
    };

    this.removePeripheral = (peripheral) => {
        store.dispatch(removePeripheral(this.server_url+'tab_creator/remove_peripheral/'+ peripheral, peripheral))
    };

}
