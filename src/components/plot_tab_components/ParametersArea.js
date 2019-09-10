import React from 'react';


import {Button, Form} from "react-bootstrap"
import {useSelector} from "react-redux";
import SingleValueField from "../Common_Components/SingleValueField";


let ParametersArea = props => {
    const parameters = useSelector(
        state => state.parameterValues
    );


    const handleSubmit = event => {
        event.preventDefault();
        let new_params = parameters;
        for(let parameter of event.target){ // eslint-disable-line no-unused-vars
            let objIndex = new_params.findIndex((obj => obj.parameter_name === parameter.name));
            let floatValue = parseFloat(parameter.value);
            if(parameter.value!=="" && new_params[objIndex].value !==floatValue){
                props.server.app_proxy.setApplicationParameters({name:parameter.name, value:floatValue});
            }
        }
    };

    return(
        <Form onSubmit={handleSubmit}>
                {parameters.map((param, i) => {
                    return(
                        <SingleValueField key={i} name={param.parameter_name} value={param.value} description={param.description}/>
                    );
                })}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
        </Form>
    );
};

export default ParametersArea;
