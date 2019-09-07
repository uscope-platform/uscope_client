import React, {Component} from 'react';

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import SingleValueField from "../Common_Components/SingleValueField";


class ParametersArea extends Component {

    render() {
        return(
            <Container>
                    {this.props.parameters.map((param) => {
                        return(
                            <SingleValueField field={param}/>
                        );
                    })}
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
            </Container>
        );
    }

}

export default ParametersArea;
