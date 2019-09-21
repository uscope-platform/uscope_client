//import store from "../store";

import axios from "axios";

export default function creatorProxy(server_url) {
    this.server_url = server_url;

    this.createPeripheral = (app, image) => {

        let formData = new FormData();
        formData.append("file", image, image.name);

        axios.post(this.server_url+'tab_creator/diagram',
            formData,
             { headers: {'Content-Type': 'multipart/form-data' }}
        ).catch(function (response) {
            //handle error
            console.log(response);
        });

        axios.post(this.server_url+'tab_creator/create_peripheral',{payload:app}).catch(err => {
            alert(err.message);
        });
    };



}
