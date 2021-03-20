//import store from "../store";

import axios from "axios";

export default function platformProxy(server_url, token) {
    let _this = this;

    this.auth_server_url = server_url+'auth/';
    this.db_server_url = server_url+'database/';

    this.config = {headers: { Authorization: `Bearer ${token}` }};

    this.get_users_list = ()=>{
        return new Promise((resolve, reject) => {
            axios.get(_this.auth_server_url+'user', _this.config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    }

    this.dump_database = () =>{
        return new Promise((resolve, reject) => {
            axios.get(_this.db_server_url+'export', _this.config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    }

}
