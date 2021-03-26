//       REACT IMPORTS
import React, {useCallback, useEffect, useState} from 'react';
//      APP RELATED IMPORTS
import serverProxy from "./ServerProxy";
import AuthApp from "./AuthApp";
import LoginPage from "./components/Common_Components/LoginPage";
//////  STYLE IMPORTS
import './App.css';
import {useDispatch} from "react-redux";
import {setSetting} from "./redux/Actions/SettingsActions";
import {ThemeProvider} from "styled-components";
import {ColorTheme} from "./components/UI_elements";

let App = (props) =>{

    const [server, set_server] = useState(new serverProxy(process.env.REACT_APP_SERVER, ''));
    const [logged, set_logged] = useState(false);
    const [onboarding_needed, set_onboarding_needed] = useState(true);
    const dispatch = useDispatch();


    const done = useCallback((login_credentials)=>{
        server.auth_proxy.sign_in(login_credentials).then((token) =>{
            let uScope_server = new serverProxy(process.env.REACT_APP_SERVER,token.access_token);

            if(token.login_token){
                localStorage.setItem('login_token', JSON.stringify(token.login_token));
            }
            set_server(uScope_server);
            dispatch(setSetting(["server", uScope_server]));
            set_logged(true);
        }).catch(()=>{
            localStorage.removeItem('login_token');
        });
    }, []);



    useEffect(()=>{

        server.platform_proxy.need_onboarding().then(response =>{
            set_onboarding_needed(response['onboarding_needed']);
            if(response['onboarding_needed']) {
                dispatch(setSetting(["server", server]));
                set_logged(true);
            } else{
                automated_login();
            }
        });

    },[])

    let automated_login = () =>{
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


