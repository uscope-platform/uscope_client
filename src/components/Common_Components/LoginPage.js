import React, {useState} from 'react';

import Button from "../UI_elements/Button"
import InputField from "../UI_elements/InputField";
import Checkbox from "../UI_elements/checkbox";

import styled from "styled-components";


const ComponentStyle = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: auto;
  grid-column-gap: 0.5rem;
  grid-row-gap: 2rem;
  margin-left: auto;
  margin-right: auto;
`


const LoginFormLayout = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: auto;
  grid-column-gap: 0.5rem;
  grid-row-gap: 1rem;
  width: 20rem;
  margin-left: auto;
  margin-right: auto;  
`

const Centering = styled.div`
  margin-left: auto;
  margin-right: auto;  
`

let  LoginPage = props =>{

    const [username, set_username] = useState("");
    const [password, set_password] = useState("");
    const [remember_me, set_remember_me] = useState(false);


    let handleChange = (event) => {
        switch (event.target.name) {
            case "username":
                set_username(event.target.value);
                break;
            case "password":
                set_password(event.target.value);
                break;
            case "remember_me":
                set_remember_me(event.target.checked);
                break;
            default:
                break;
        }
    };

    let handleSignIn = () =>{
        let login_credentials = {"user":username, "password":password, "remember_me": remember_me, 'login_type':'user'};
        props.done(login_credentials);
    };

    return(
        <ComponentStyle>
            <Centering>
                <h1>Please Sign In</h1>
            </Centering>
            <LoginFormLayout>
                <InputField name='username' compact onChange={handleChange} label="Username"/>
                <InputField name='password' type='password' compact onChange={handleChange} label="Password"/>
                <Checkbox name='remember_me' onChange={handleChange} value={remember_me} label="Remember Me"/>
            </LoginFormLayout>
            <Centering>
                <Button onClick={handleSignIn}>Sign In</Button>
            </Centering>
        </ComponentStyle>
    );
};

export default LoginPage;