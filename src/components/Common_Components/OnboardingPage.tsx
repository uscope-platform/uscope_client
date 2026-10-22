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
import {styled} from "goober";

import {Button, ColorTheme, InputField} from "#UI/index.js";
import {do_onboarding} from "#client_core/index.js";
import {error_text} from "#client_core/proxy/errors.js";

const Page = styled('div')`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const Card = styled('form')`
  width: 100%;
  max-width: 26rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border-radius: 0.75rem;
  border: 1px solid ${ColorTheme.background.borders};
  background: ${ColorTheme.background.level_2};
`

const Title = styled('h1')`
  font-size: 1.6rem;
`

const Intro = styled('p')`
  opacity: 0.7;
  font-size: 0.9rem;
`

const Fields = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const Problem = styled('div')`
  color: ${ColorTheme.field.error};
  font-size: 0.85rem;
  min-height: 1.2em;
`

const Note = styled('p')`
  opacity: 0.6;
  font-size: 0.8rem;
`

const SubmitButton = styled(Button)`
  width: 100%;
  &:disabled { opacity: 0.6; }
`

interface OnboardingPageProps {
    onboarding_done: () => void;
}

/// The first screen of a new platform: it creates the account of the administrator
let OnboardingPage = (props: OnboardingPageProps) =>{

    const [username, set_username] = useState("");
    const [password, set_password] = useState("");
    const [confirmation, set_confirmation] = useState("");
    const [problem, set_problem] = useState("");
    const [submitting, set_submitting] = useState(false);

    let handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        set_problem("");
        switch (event.target.name) {
            case "username":
                set_username(event.target.value);
                break;
            case "password":
                set_password(event.target.value);
                break;
            case "confirmation":
                set_confirmation(event.target.value);
                break;
        }
    };

    let handleSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        if(username.trim() === ""){
            set_problem("Choose a username");
        } else if(password === ""){
            set_problem("Choose a password");
        } else if(password !== confirmation){
            set_problem("The passwords do not match");
        } else {
            set_submitting(true);
            try{
                await do_onboarding({user: username.trim(), password: password, role: "admin"});
                props.onboarding_done();
                return;
            } catch (e) {
                set_problem(error_text(e));
            }
            set_submitting(false);
        }
    };

    return(
        <Page>
            <Card onSubmit={handleSubmit}>
                <div>
                    <Title>Welcome to µScope</Title>
                    <Intro>This platform has no users yet. Create the administrator account to get started.</Intro>
                </div>
                <Fields>
                    <InputField name="username" id="username" label="Username" onChange={handleChange}/>
                    <InputField name="password" id="password" type="password" label="Password" onChange={handleChange}/>
                    <InputField name="confirmation" id="confirmation" type="password" label="Confirm password" onChange={handleChange}/>
                </Fields>
                <Problem role="alert">{problem}</Problem>
                <SubmitButton type="submit" disabled={submitting}>Create administrator account</SubmitButton>
                <Note>More users can be added later from the Platform page.</Note>
            </Card>
        </Page>
    );
};

export default OnboardingPage;
