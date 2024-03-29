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

import {Button, SelectField} from "../UI_elements"
import {useSelector} from "react-redux";
import styled from "styled-components";
import app from "../../App";


const ComponentLayout = styled.div`
display: flex;
flex-direction: column;

`
const Centering = styled.div`
  margin-left: auto;
  margin-right: auto;  
`

let ApplicationChooserView = props =>{

    const applications = useSelector(state => state.applications);
    const ppp = useSelector(state => state.peripherals);

    let apps_list = Object.entries(applications).map((application,i) => ({
        value:parseInt(application[0]),
        label:application[1].application_name
    }))

    let last_app = localStorage.getItem("last_selected_application");

    let default_app = last_app ? {
        value:parseInt(last_app),
        label:applications[parseInt(last_app)].application_name
    }:apps_list[0];

    const [selected, set_selected] = useState(default_app);

    let handle_close = (event) =>{
        event.preventDefault();
        localStorage.setItem("last_selected_application",selected.value);
        props.done(selected.value);
    };

    return(
        <ComponentLayout>
            <Centering>
                <SelectField
                    name="application_selector"
                    label="Chose An Application"
                    onChange={set_selected}
                    value={selected}
                    options={apps_list}
                />
                <Button style={{margin:"1rem 1rem"}} onClick={handle_close}>Save changes</Button>
            </Centering>
        </ComponentLayout>
    );

}


export default ApplicationChooserView;
