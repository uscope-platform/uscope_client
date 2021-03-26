import axios from "axios"
import store from "../store";



let AuthProxy = class {

    sign_in = (credentials) => {
        return new Promise((resolve, reject) => {
            let state = store.getState();
            axios.post(state.settings.server_url+'auth/login', credentials)
                .then(res => {
                    resolve(res.data);
                }).catch(
                error => {
                    alert("login failed");
                    reject("Login Failed");
                });
        });
    };

    sign_out = () => {

    };
};



export default AuthProxy;

