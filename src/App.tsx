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
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
//      APP RELATED IMPORTS
import AuthApp from "./AuthApp.js";
import LoginPage from "./components/Common_Components/LoginPage.js";
import store from "./store.js";
import {set_address, set_auth_config, set_redux_store, need_onboarding} from "#client_core/index.js";

//////  STYLE IMPORTS
import './App.css';
import {auto_sign_in, manual_sign_in} from "./client_core/proxy/auth.js";
import {backend_error, error_text, report_error} from "./client_core/proxy/errors.js";
import OnboardingPage from "./components/Common_Components/OnboardingPage.js";
import ServerUnreachable from "./components/Common_Components/ServerUnreachable.js";
import type {AutoAuthRequest, login_token, ManualAuthRequest, UserRole} from "#interfaces/index.js";

interface AppProps {

}

let App = (props: AppProps) =>{


    const [logged, set_logged] = useState(false);
    // what the platform needs before anyone can log in: asking, a first account, nothing, or no answer
    const [setup, set_setup] = useState<"checking" | "onboarding" | "ready" | "unreachable">("checking");
    const [setup_problem, set_setup_problem] = useState("");
    const [user_role, set_user_role] = useState<UserRole>("operator");

    const done = useCallback(async (login_credentials: ManualAuthRequest | AutoAuthRequest)=>{
        try {
            let token: login_token;
            if(login_credentials.login_type === "user"){
                token = await manual_sign_in(login_credentials);
            } else {
                token = await auto_sign_in(login_credentials);
            }
            if(token.login_token){
                localStorage.setItem('login_token', JSON.stringify(token.login_token));
            }
            set_user_role(token.role);
            set_auth_config({headers: { Authorization: `Bearer ${token.access_token}` }});
            set_logged(true);
        } catch (e) {
            localStorage.removeItem('login_token');
        }

    }, []);



    // the failures of the server nobody handled are shown, instead of being lost in the console
    useEffect(()=>{
        const on_rejection = (event: PromiseRejectionEvent) =>{
            if(!(event.reason instanceof backend_error)) return;
            event.preventDefault();
            report_error(event.reason);
        };
        window.addEventListener("unhandledrejection", on_rejection);
        return () => window.removeEventListener("unhandledrejection", on_rejection);
    }, []);

    // try_automated_login is declared below, it is only called once the platform answered
    const check_setup = useCallback(() =>{
        set_setup("checking");
        need_onboarding().then(needed =>{
            set_setup(needed ? "onboarding" : "ready");
            if(!needed) try_automated_login();
        }).catch((e) =>{
            set_setup_problem(error_text(e));
            set_setup("unreachable");
        });
    }, []);

    useEffect(()=>{
        set_address(import.meta.env.VITE_APP_SERVER);
        set_redux_store(store);
        check_setup();
    },[])

    let try_automated_login = () =>{
        let raw_token = localStorage.getItem('login_token');
        if(raw_token ===null)return;
        let token = JSON.parse(raw_token);
        if(token){
            if (Date.now() < Date.parse(token.expiry)){
                token.login_type = 'automated';
                done(token)
            } else {
                localStorage.removeItem('login_token');
            }
        }
    }

    const content = () =>{
        switch (setup) {
            case "checking":
                return <></>;
            case "unreachable":
                return <ServerUnreachable message={setup_problem} on_retry={check_setup}/>;
            case "onboarding":
                // the account that was just created logs in from the login page
                return <OnboardingPage onboarding_done={() => set_setup("ready")}/>;
            case "ready":
                return logged ? <AuthApp user_role={user_role}/> : <LoginPage done={done}/>;
        }
    };

    return(
        <div className="App">
            <React.StrictMode>
                {content()}
            </React.StrictMode>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                style={{whiteSpace: "pre-line"}}
            />
        </div>
    )

}

export default App;


