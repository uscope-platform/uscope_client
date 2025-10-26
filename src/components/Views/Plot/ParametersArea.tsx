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

import {Button, FormLayout, InputField} from "#UI/index.js"
import {run_parameter_script} from "#client_core/index.js";
import type {parameter} from "#interfaces/index.js";

interface ParametersAreaProps {
    parameters: parameter[]
}

let  ParametersArea = (props: ParametersAreaProps) =>{

    //This effect hook initializes the parameters values
    useEffect(() => {
        for(let elem of props.parameters){
            let local_elem = elem;
            local_elem.parameter_name = elem.parameter_id;
            let value = "";
            if(typeof local_elem.value === "number" ){
                value = local_elem.value.toString();
            } else{
                value = local_elem.value;
            }
            run_parameter_script( local_elem.parameter_name, value);
        }
    }, []);


    let handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        Array.from(event.currentTarget.elements).map((e) => {
            //Parse parameter value and find out if it has changed
            let parameter= e as HTMLInputElement;
            if(parameter.value !== ""){
                run_parameter_script( parameter.name, parameter.value);
            }
        });
    };

    return(
        <form onSubmit={handleSubmit}>
            <FormLayout>
                    {
                        props.parameters.map((param, i) => {
                            if(param.visible){
                                return(
                                    <div key={param.parameter_id + "_input_area"}>
                                        <InputField
                                            placeholder={param.value.toString()}
                                            name={param.parameter_id}
                                            label={param.parameter_id}
                                        />
                                    </div>

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