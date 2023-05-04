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

import React, {useState} from 'react';

import {Button, Checkbox, InputField} from "../UI_elements"

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
                <h1 id='login_page_title'>Please Sign In</h1>
            </Centering>
            <LoginFormLayout>
                <InputField name='username' compact onChange={handleChange} label="Username"/>
                <InputField name='password' type='password' compact onChange={handleChange} label="Password"/>
                <Checkbox name='remember_me' onChange={handleChange} value={remember_me} label="Remember Me"/>
            </LoginFormLayout>
            <Centering>
                <Button name="sign_in_button" onClick={handleSignIn}>Sign In</Button>
            </Centering>
        </ComponentStyle>
    );
};

export default LoginPage;