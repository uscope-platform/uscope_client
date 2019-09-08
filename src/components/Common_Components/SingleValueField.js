import React from 'react';

import Form from "react-bootstrap/Form";

let SingleValueField = props => {
        return(
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props.field.qualified_name}</Form.Label>
                <Form.Control type="text" className='oneField' name={props.field.qualified_name} placeholder={props.field.value} />
                <Form.Text className="text-muted">
                    {props.field.description}
                </Form.Text>
            </Form.Group>
        );
};

export default SingleValueField;
