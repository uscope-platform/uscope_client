import axios from "axios"
import {loadParameters} from "../redux/Actions/ParameterActions";
import {sendParameter} from "../redux/Actions/ParameterActions";
import store from "../store";
import {setChannelSetting} from "../redux/Actions/plotActions";

export default function applicationProxy(server_url) {
    let _this = this;
    this.server_url = server_url;

    this.getApplicationsList = function () {
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'application/list')
                .then(res => {
                    resolve(res.data);
                })
        });

    };

    this.getApplicationParameters = function (){
        store.dispatch(loadParameters(_this.server_url+'application/parameters'));
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

    this.setChannelLimits = (min_val, max_val, id) =>{
        let message = [{name:'min_value', channel_id:id, value:min_val},{name:'min_value', channel_id:id, value:min_val}];
        store.dispatch(setChannelSetting(_this.server_url+'plot/channels/params', message));
    }

}




