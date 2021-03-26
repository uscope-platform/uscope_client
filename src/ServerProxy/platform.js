import axios from "axios";

let platformProxy = class{
    constructor(server_url, token) {
        this.auth_server_url = server_url+'auth/';
        this.db_server_url = server_url+'database/';

        this.config = {headers: { Authorization: `Bearer ${token}` }};
    }


    add_user = user =>{
        return new Promise((resolve, reject) => {
            axios.post(this.auth_server_url+'user', user, this.config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    };

    remove_user = user =>{
        return new Promise((resolve, reject) => {
            axios.delete(this.auth_server_url+'user', {...this.config, data:user}).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    };

    need_onboarding = () =>{
        return new Promise((resolve, reject) => {
            axios.get(this.auth_server_url+'onboarding').then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    };

    do_onboarding = user =>{
        return new Promise((resolve, reject) => {
            axios.post(this.auth_server_url+'onboarding', user, this.config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    };

    get_users_list = ()=>{
        return new Promise((resolve, reject) => {
            axios.get(this.auth_server_url+'user', this.config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    }

    dump_database = () =>{
        return new Promise((resolve, reject) => {
            axios.get(this.db_server_url+'export', this.config).then(res =>{
                resolve(res.data);
            }).catch(err=>{
                reject(err.message);
            })
        });
    }

    restore_database = (db_file) =>{
        axios.post(this.db_server_url+'import',db_file, this.config);
    }

}

export default platformProxy;
