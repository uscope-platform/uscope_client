import React from 'react';


import {Button, Form} from "react-bootstrap"
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import SingleValueField from "../Common_Components/SingleValueField";
import {setParameterValue} from "../../redux/Actions/ParameterActions";


let ParametersArea = props => {
    const parameters = useSelector(
        state => state.parameterValues
    );

    const dispatch = useDispatch();

    const handleSubmit = event => {
        event.preventDefault();
        let new_params = parameters;
        for(let parameter of event.target){ // eslint-disable-line no-unused-vars
            let objIndex = new_params.findIndex((obj => obj.qualified_name === parameter.name));
            let floatValue = parseFloat(parameter.value);
            if(parameter.value!=="" && new_params[objIndex].value !==floatValue){
                dispatch(setParameterValue(parameter.name, floatValue));
            }
        }
    };

    return(
        <Form onSubmit={handleSubmit}>
                {parameters.map((param) => {
                    return(
                        <SingleValueField field={param}/>
                    );
                })}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
        </Form>
    );
};

export default ParametersArea;
