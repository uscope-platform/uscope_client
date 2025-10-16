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

import React, {useEffect} from 'react';

import {Button, FormLayout} from "@UI"
import SingleValueField from "../../Common_Components/SingleValueField";
import {run_parameter_script} from "#client_core";

let  ParametersArea = props =>{

    //This effect hook initializes the parameters values
    useEffect(() => {
        for(let elem of props.parameters){
            let local_elem = elem;
            local_elem.name = elem.parameter_id;
            run_parameter_script( local_elem.name, local_elem.value).then();
        }
    }, []);


    let handleSubmit = event => {
        event.preventDefault();
        for(let parameter of event.target){
            //Parse parameter value and find out if it has changed
            if(parameter.value !== ""){
                run_parameter_script( parameter.name, parameter.value).then();
            }
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <FormLayout>
                    {
                        props.parameters.map((param, i) => {
                            if(param.visible){
                                return(
                                    <SingleValueField key={i} name={param.parameter_id} placeholder={param.value} description={param.description}/>
                                );
                            } else{
                                return null;
                            }
                        })
                    }
                <Button> Submit </Button>
            </FormLayout>
        </form>
    );
};

export default ParametersArea;