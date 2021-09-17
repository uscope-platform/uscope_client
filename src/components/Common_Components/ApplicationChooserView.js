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

import React from 'react';

import {Button, Label, Select} from "../UI_elements"
import {useSelector} from "react-redux";
import styled from "styled-components";


const ComponentLayout = styled.div`
display: flex;
flex-direction: column;

`
const Centering = styled.div`
  margin-left: auto;
  margin-right: auto;  
`

const Title = styled.h1`
font-size: 2em;
`

let ApplicationChooserView = props =>{

    const applications = useSelector(state => state.applications);

    let handle_close = (event) =>{
        event.preventDefault();
        let app = event.target.application_selector.value;
        props.done(app);
    };

    return(
        <ComponentLayout>
            <Centering>
                <Title id='app_chooser_title'>Application Choice</Title>
                <Label>Application Name</Label>
                <form id='application_chooser_form' onSubmit={handle_close}>
                    <Select name="application_selector">
                        {Object.entries(applications).map((application,i) => (
                            <option value={application[0]} key={i} >{application[0]}</option>
                        ))}
                    </Select>
                    <Button style={{margin:"1rem 1rem"}} name='application_chooser_submit' type="submit">Save changes</Button>
                </form>
            </Centering>
        </ComponentLayout>
    );

}


export default ApplicationChooserView;
