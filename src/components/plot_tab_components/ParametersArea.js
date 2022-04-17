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

import {BlockLayout, BlockTitle, Button, FormLayout} from "../UI_elements"
import {useSelector} from "react-redux";
import SingleValueField from "../Common_Components/SingleValueField";
import {run_parameter_script} from "../../client_core";
import store from "../../store";

let  ParametersArea = props =>{
    const applications = useSelector(state => state.applications)
    const settings = useSelector(state => state.settings);

    let parameters = applications[settings["application"]].parameters;

    //This effect hook initialized the parameters values
    useEffect(() => {
        for(let elem of parameters){
            //initialize_parameter(store, elem);
            let local_elem = elem;
            local_elem.name = elem.parameter_id;
            run_parameter_script(store, local_elem);
        }
    }, []);


    let handleSubmit = event => {
        event.preventDefault();
        for(let parameter of event.target){ // eslint-disable-line no-unused-vars
            //Parse parameter value and find out if it has changed
            if(parameter.value !== ""){
                run_parameter_script(store, parameter);
            }
        }
    };

    return(
        <BlockLayout>
            <BlockTitle>Parameters</BlockTitle>
            <form onSubmit={handleSubmit}>
                <FormLayout>
                    {
                        parameters.map((param, i) => {
                        if(param.visible){
                            return(
                                <SingleValueField key={i} name={param.parameter_id} placeholder={param.value} description={param.description}/>
                            );
                        } else{
                            return null;
                        }
                    })}
                    <Button> Submit </Button>
                </FormLayout>
            </form>
        </BlockLayout>
    );
};

export default ParametersArea;