import React from 'react';

import Form from "react-bootstrap/Form";
import {Col, Image, Row} from "react-bootstrap";

let SingleValueField = props => {


    let localRemoveHandler = () =>{
        props.handle_remove(props.name);
    };

    if(props.preview_only){
        return(
            <Row>
                <Col fluid={true}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{props.name}</Form.Label>
                        <Form.Control type="text" className='oneField' name={props.name} placeholder={props.value} />
                        <Form.Text className="text-muted">
                            {props.description}
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Image src='assets/Icons/remove.svg'className='remove_registers_image'  onClick={localRemoveHandler}/>
                </Col>
            </Row>
        );
    } else{
        return(
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{props.name}</Form.Label>
                <Form.Control type="text" className='oneField' name={props.name} placeholder={props.value} />
                <Form.Text className="text-muted">
                    {props.description}
                </Form.Text>
            </Form.Group>
        );
    }
};

export default SingleValueField;
