import React from 'react';

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

//import {useSelector} from "react-redux";

import SingleValueField from "../Common_Components/SingleValueField";


let ParametersArea = props => {
    return(
        <Container>
                {props.parameters.map((param) => {
                    return(
                        <SingleValueField field={param}/>
                    );
                })}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
        </Container>
    );
};

export default ParametersArea;
