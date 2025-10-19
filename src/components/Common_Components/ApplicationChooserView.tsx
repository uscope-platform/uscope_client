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

import {Button, SelectField} from "#UI/index.js"
import {styled} from "goober";
import type {application} from "#interfaces/index.js";
import type {ActionMeta} from "react-select";


const ComponentLayout = styled('div')`
display: flex;
flex-direction: column;

`
const Centering = styled('div')`
  margin-left: auto;
  margin-right: auto;  
`

interface ApplicationChooserViewProps {
    applications: Record<number, application>;
    done: (application_id: number) => void;
}

interface AppChooserOption {
    label: string;
    value: number;
}

let ApplicationChooserView = (props: ApplicationChooserViewProps) =>{

    let apps_list = Object.entries(props.applications).map((application,i) => ({
        value:parseInt(application[0]),
        label:application[1].application_name
    }))

    const [selected, set_selected] = useState({value:0, label:"Select an application"});

    useEffect(()=>{
        let last_app = localStorage.getItem("last_selected_application");
        if(last_app){
            let selected_app = props.applications[parseInt(last_app)];
            if(selected_app){
                set_selected({
                    value:parseInt(last_app),
                    label:selected_app.application_name
                })
            }
        } else {
            let def = apps_list[0];
            if(def) set_selected(def);
        }
    },[])



    let handle_select = (value: AppChooserOption | null, event: ActionMeta<AppChooserOption>) =>{
        if(!value) return;
        set_selected(value);
    }

    let handle_close = (event:React.MouseEvent<HTMLButtonElement>) =>{
        localStorage.setItem("last_selected_application",selected.value.toString());
        props.done(selected.value);
    };

    return(
        <ComponentLayout>
            <Centering>
                <SelectField<AppChooserOption>
                    name="application_selector"
                    label="Chose An Application"
                    onChange={handle_select}
                    value={selected}
                    options={apps_list}
                />
                <Button style={{margin:"1rem 1rem"}} onClick={handle_close}>Save changes</Button>
            </Centering>
        </ComponentLayout>
    );

}


export default ApplicationChooserView;
