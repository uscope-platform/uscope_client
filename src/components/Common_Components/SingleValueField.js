import React from 'react';

import Form from "react-bootstrap/Form";

let SingleValueField = props => {
        return(
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props.name}</Form.Label>
                <Form.Control type="text" className='oneField' name={props.name} placeholder={props.value} />
                <Form.Text className="text-muted">
                    {props.description}
                </Form.Text>
            </Form.Group>
        );
};

export default SingleValueField;
