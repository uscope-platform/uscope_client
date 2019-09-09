import React from 'react';

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col"


let TwoValuesField = props => {
        return(
            <Form.Row >
                <Col>
                    <Form.Group controlId="first_input">
                        <Form.Label>{props.field.display_name[0]}</Form.Label>
                        <Form.Control className='twoFields.1' type="text" id={props.field.qualified_name+'.1'} placeholder={props.field.value[0]} />
                        <Form.Text className="text-muted">
                            {props.field.description[0]}
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="second_input">
                        <Form.Label>{props.field.display_name[1]}</Form.Label>
                        <Form.Control className='twoFields.2' type="text" id={props.field.qualified_name+'.2'} placeholder={props.field.value[1]} />
                        <Form.Text className="text-muted">
                            {props.field.description[1]}
                        </Form.Text>
                    </Form.Group>
                </Col>
            </Form.Row>
        );
};

export default TwoValuesField;
