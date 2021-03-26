import axios from "axios"
import store from "../store";
import {addScript, editScript, loadAllScripts, removeScript} from "../redux/Actions/scriptsActions"

let ScriptsProxy = class{

    upload_script = (script) => {
        let state = store.getState();
        store.dispatch(addScript(state.settings.server_url+'script/'+script.id, script, state.settings.auth_config));
    };

    edit_script = (script) => {
        let state = store.getState();
        store.dispatch(editScript(state.settings.server_url+'script/'+script.id, script, state.settings.auth_config));
    };

    load_all = () =>{
        let state = store.getState();
        store.dispatch(loadAllScripts(state.settings.server_url+'script/none', state.settings.auth_config));
    };

    get_hash = () =>{
        return new Promise( (resolve, reject) => {
            let state = store.getState();
            axios.get(state.settings.server_url+'script/hash', state.settings.auth_config)
                .then(res => {
                    resolve(res.data);
                })
        });
    };

    delete_script = (script) => {
        let state = store.getState();
        store.dispatch(removeScript(state.settings.server_url+'script/'+script.id, script, state.settings.auth_config));
    };

}

export default ScriptsProxy;
