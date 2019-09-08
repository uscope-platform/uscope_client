import axios from "axios"

export default function applicationProxy(server_url) {
    let _this = this;
    this.server_url = server_url;


   this.getApplicationsList = function () {
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'/application/list')
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




