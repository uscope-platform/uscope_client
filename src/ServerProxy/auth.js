import axios from "axios"



let authProxy = class {
    constructor(server_url) {
      this.server_url = server_url+'auth/';
    }

    sign_in = (credentials) => {
        return new Promise((resolve, reject) => {
            axios.post(this.server_url+'login', credentials)
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



export default authProxy;

