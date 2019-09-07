import React from 'react';

import Form from "react-bootstrap/Form";

let SingleValueField = props => {
        return(
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props.field.name}</Form.Label>
                <Form.Control type="text" placeholder={props.field.default_value} />
                <Form.Text className="text-muted">
                    {props.field.description}
                </Form.Text>
            </Form.Group>
        );
};

export default SingleValueField;
