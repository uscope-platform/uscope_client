// Copyright 2021 University of Nottingham Ningbo China
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//       REACT IMPORTS
import React, {useCallback, useEffect, useState} from 'react';
//      APP RELATED IMPORTS
import serverProxy from "./ServerProxy";
import AuthApp from "./AuthApp";
import LoginPage from "./components/Common_Components/LoginPage";
import store from "./store";
import {set_address, set_auth_config, set_redis_store, sign_in} from "./client_core";

//////  STYLE IMPORTS
import './App.css';
import {useDispatch} from "react-redux";
import {setSetting} from "./redux/Actions/SettingsActions";
import {ThemeProvider} from "styled-components";
import {ColorTheme} from "./components/UI_elements";


let App = (props) =>{

    const [server] = useState(new serverProxy());
    const [logged, set_logged] = useState(false);
    const [onboarding_needed, set_onboarding_needed] = useState(true);
    const dispatch = useDispatch();

    const done = useCallback((login_credentials)=>{
        sign_in(login_credentials).then((token) =>{
            if(token.login_token){
                localStorage.setItem('login_token', JSON.stringify(token.login_token));
            }

            dispatch(setSetting(["user_role", token.role]));
            dispatch(setSetting(["access_token", token.access_token]));
            dispatch(setSetting(["auth_config", {headers: { Authorization: `Bearer ${token.access_token}` }}]));
            set_auth_config({headers: { Authorization: `Bearer ${token.access_token}` }});
            set_logged(true);
        }).catch(()=>{
            localStorage.removeItem('login_token');
        });
    }, []);



    useEffect(()=>{
        dispatch(setSetting(["server_url", process.env.REACT_APP_SERVER]));
        set_address(process.env.REACT_APP_SERVER);
        set_redis_store(store);
        dispatch(setSetting(["server", new serverProxy()]));

        server.platform_proxy.need_onboarding().then(response =>{
            set_onboarding_needed(response['onboarding_needed']);
            if(response['onboarding_needed']) {
                set_logged(true);
            } else{
                try_automated_login();
            }
        });

    },[])

    let try_automated_login = () =>{
        let token = JSON.parse(localStorage.getItem('login_token'));
        if(token){
            if (Date.now() > token.expiry){
                token.login_type = 'automated';
                done(token)
            } else {
                localStorage.removeItem('login_token');
            }
        }
    }

    let onboarding_done = () =>{
        set_logged(false);
        set_onboarding_needed(false);
    }

    return(
        <ThemeProvider theme={ColorTheme}>
            <div className="App">
                {logged? <AuthApp onboarding_done={onboarding_done} needs_onboarding={onboarding_needed}/>:<LoginPage server={server} done={done}/>}
            </div>
        </ThemeProvider>
    )

}

export default App;


