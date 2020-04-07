import axios from "axios"
import store from "../store";
import {addScript, removeScript, loadAllScripts, editScript} from "../redux/Actions/scriptsActions"

export default function scriptsProxy(server_url, token) {
    let _this = this;
    this.server_url = server_url;
    this.config = {headers: { Authorization: `Bearer ${token}` }};

    this.upload_script = function (script) {
        store.dispatch(addScript(_this.server_url+'script/'+script.id, script, _this.config));
    };

    this.edit_script = function (script) {
        store.dispatch(editScript(_this.server_url+'script/'+script.id, script, _this.config));
    };

    this.download_all_scripts = () =>{
        store.dispatch(loadAllScripts(_this.server_url+'script/none', _this.config));
    };

    this.get_hash = () =>{
        return new Promise(function (resolve, reject) {
            axios.get(_this.server_url+'script/hash', _this.config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    this.delete_script = function (script) {
        store.dispatch(removeScript(_this.server_url+'script/'+script.id, script, _this.config));
    };

}




