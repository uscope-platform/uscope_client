import axios from "axios"
import store from "../store";
import {setChannelSetting} from "../redux/Actions/plotActions";
import {
    addApplication,
    editApplication,
    loadApplications,
    removeApplication
} from "../redux/Actions/applicationActions";

export default function applicationProxy(server_url, token) {
    let _this = this;
    this.server_url = server_url;
    this.config = {headers: { Authorization: `Bearer ${token}` }};

    this.load_all = () =>{
        store.dispatch(loadApplications(_this.server_url+'application/all/specs', _this.config))
    };

    this.setApplication = function (app_name) {
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'application/set/'+app_name, _this.config)
                .then(res => {
                    resolve(res.data);
                }).catch(error => {
                    reject(error);
                });
        });
    };

    this.setChannelLimits = (min_val, max_val, id) =>{
        let message = [{name:'min_value', channel_id:id, value:min_val},{name:'min_value', channel_id:id, value:min_val}];
        store.dispatch(setChannelSetting(_this.server_url+'plot/channels/params', message, _this.config));
    };

    this.get_hash = () =>{
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'application/digest', _this.config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    this.createApplication = (application_obj) => {
        store.dispatch(addApplication(_this.server_url+'application/add', application_obj, _this.config));
    };

    this.edit_application = (edit) => {
        store.dispatch(editApplication(this.server_url+'application/edit', edit, this.config));
    };

    this.removeApplication = (application) =>{
        store.dispatch(removeApplication(_this.server_url+'application/remove/'+application, application, _this.config));
    };
}




