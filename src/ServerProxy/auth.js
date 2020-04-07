import axios from "axios"

export default function authProxy(server_url) {
    let _this = this;
    this.server_url = server_url+'auth/';

    this.sign_in = (credentials) => {
        return new Promise(function (resolve, reject) {
            axios.post(_this.server_url+'login', credentials)
                .then(res => {
                    resolve(res.data);
                }).catch(
                    error => {
                        alert("login failed");
                        reject("Login Failed");
                });
        });
    };

    this.sign_out = () => {

    };

}




