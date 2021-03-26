import axios from "axios"
import store from "../store";
import {setChannelSetting} from "../redux/Actions/plotActions";
import {
    addApplication,
    editApplication,
    loadApplications,
    removeApplication
} from "../redux/Actions/applicationActions";

 let applicationProxy = class {
     constructor(server_url, token) {
         this.server_url = server_url;
         this.config = {headers: { Authorization: `Bearer ${token}` }};
     }

     load_all = () =>{
         store.dispatch(loadApplications(this.server_url+'application/all/specs', this.config))
     };

     setApplication = (app_name) => {
         return new Promise( (resolve, reject) => {
             axios.get(this.server_url+'application/set/'+app_name, this.config)
                 .then(res => {
                     resolve(res.data);
                 }).catch(error => {
                 reject(error);
             });
         });
     };

     setChannelLimits = (min_val, max_val, id) =>{
         let message = [{name:'min_value', channel_id:id, value:min_val},{name:'min_value', channel_id:id, value:min_val}];
         store.dispatch(setChannelSetting(this.server_url+'plot/channels/params', message, this.config));
     };

     get_hash = () =>{
         return new Promise( (resolve, reject) => {
             axios.get(this.server_url+'application/digest', this.config)
                 .then(res => {
                     resolve(res.data);
                 })
         });
     };

     createApplication = (application_obj) => {
         store.dispatch(addApplication(this.server_url+'application/add', application_obj, this.config));
     };

     edit_application = (edit) => {
         store.dispatch(editApplication(this.server_url+'application/edit', edit, this.config));
     };

     removeApplication = (application) =>{
         store.dispatch(removeApplication(this.server_url+'application/remove/'+application, application, this.config));
     };
 };



export default applicationProxy;


