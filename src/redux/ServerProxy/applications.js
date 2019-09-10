import axios from "axios"
import {loadParameters} from "../Actions/ParameterActions";
import {sendParameter} from "../Actions/ParameterActions";
import store from "../../store";

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

    this.getApplicationParameters = function (){
        store.dispatch(loadParameters(_this.server_url+'/application/parameters'));
    };

    this.setApplicationParameters = function (parameter){
        store.dispatch(sendParameter(_this.server_url+'application/parameters', parameter));
    };

    this.getApplication = function (app_name) {
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'application/specs/'+app_name)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    this.createApplication = function (application) {
        return;
    };
}




