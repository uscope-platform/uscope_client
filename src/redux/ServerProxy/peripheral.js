import axios from "axios"

export default function peripheralProxy(server_url) {
    let _this = this;
    this.server_url = server_url;


    this.getPeripheralRegisters = function (peripheral_name) {
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'registers/'+peripheral_name+'/descriptions')
                .then(res => {
                    resolve(res.data);
                })
        });
    };


    this.setApplication = function (app_name) {

    };


    this.createApplication = function (application) {
        return;
    };
}




