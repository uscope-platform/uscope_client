//       REACT AND BOOTSTRAP IMPORTS
import React, {useCallback, useEffect, useState} from 'react';
//      APP RELATED IMPORTS
import serverProxy from "./ServerProxy";
import AuthApp from "./AuthApp";
import LoginPage from "./components/Common_Components/LoginPage";
//////  STYLE IMPORTS
import './App.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {useDispatch} from "react-redux";
import {setSetting} from "./redux/Actions/SettingsActions";
import {ThemeProvider} from "styled-components";
import {ColorTheme} from "./components/UI_elements";

let App = (props) =>{
    // home: http://192.168.1.2/uscope/
    // unimore:http://155.185.48.185/uscope/
    // debug:http://0.0.0.0:8989/uscope/
    // unnc:http://10.190.0.74:4999/uscope/

    const [server, set_server] = useState(new serverProxy('http://0.0.0.0:8989/uscope/', ''));
    const [logged, set_logged] = useState(false);
    const dispatch = useDispatch();


    const done = useCallback((login_credentials)=>{
        server.auth_proxy.sign_in(login_credentials).then((token) =>{
            let uScope_server = new serverProxy('http://0.0.0.0:8989/uscope/',token.access_token); //home: http://192.168.1.2/uscope/ unimore:http://155.185.48.185/uscope/ docker:http://172.18.0.1:4999/uscope/ unnc:http://10.190.0.74:4999/uscope/
            if(token.login_token){
                localStorage.setItem('login_token', JSON.stringify(token.login_token));
            }
            set_server(uScope_server);
            dispatch(setSetting(["server", uScope_server]));
            set_logged(true);
        });
    }, []);

    useEffect(()=>{
        let token = JSON.parse(localStorage.getItem('login_token'));
        if(token){
            if (Date.now() > token.expiry){
                token.login_type = 'automated';
                done(token)
            } else {
                localStorage.removeItem('login_token');
            }
        }
    },[done])

    return(
        <ThemeProvider theme={ColorTheme}>
            <div className="App">
                {logged? <AuthApp />:<LoginPage server={server} done={done}/>}
            </div>
        </ThemeProvider>
    )

}

export default App;


