import axios from "axios"
import store from "../store";
import {addScript, editScript, loadAllScripts, removeScript} from "../redux/Actions/scriptsActions"

let scriptsProxy = class{
    constructor(server_url, token) {
        this.server_url = server_url;
        this.config = {headers: { Authorization: `Bearer ${token}` }};
    }

    upload_script = (script) => {
        store.dispatch(addScript(this.server_url+'script/'+script.id, script, this.config));
    };

    edit_script = (script) => {
        store.dispatch(editScript(this.server_url+'script/'+script.id, script, this.config));
    };

    load_all = () =>{
        store.dispatch(loadAllScripts(this.server_url+'script/none', this.config));
    };

    get_hash = () =>{
        return new Promise( (resolve, reject) => {
            axios.get(this.server_url+'script/hash', this.config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    delete_script = (script) => {
        store.dispatch(removeScript(this.server_url+'script/'+script.id, script, this.config));
    };

}

export default scriptsProxy;
