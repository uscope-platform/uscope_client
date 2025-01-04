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

import React, {useEffect, useState} from 'react';

import {Button, SelectField} from "@UI"
import styled from "styled-components";


const ComponentLayout = styled.div`
display: flex;
flex-direction: column;

`
const Centering = styled.div`
  margin-left: auto;
  margin-right: auto;  
`

let ApplicationChooserView = props =>{

    let apps_list = Object.entries(props.applications).map((application,i) => ({
        value:parseInt(application[0]),
        label:application[1].application_name
    }))

    const [selected, set_selected] = useState(null);

    useEffect(()=>{
        let last_app = localStorage.getItem("last_selected_application");
        if(last_app && props.applications.hasOwnProperty(parseInt(last_app))){
            set_selected({
                value:parseInt(last_app),
                label:props.applications[parseInt(last_app)].application_name
            })
        } else {
            set_selected(apps_list[0]);
        }
    },[])




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
