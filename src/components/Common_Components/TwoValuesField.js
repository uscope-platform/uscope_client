import React from 'react';

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col"
import {Image, Row} from "react-bootstrap";


let TwoValuesField = props => {

    let localRemoveHandler = () =>{
        props.handle_remove(props.register_name);
    };

    let localEditHandler = () =>{
        props.handle_edit(props.regID);
    };


    if(props.preview_only){
        return(
            <Row>
                <Col fluid={true}>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>{props.field_names[0]}</Form.Label>
                                <Form.Control className='twoFields.1' type="text" id={props.register_name+'.1'} placeholder={props.value[0]} />
                                <Form.Text className="text-muted">
                                    {props.field_descriptions[0]}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>{props.field_names[1]}</Form.Label>
                                <Form.Control className='twoFields.2' type="text" id={props.C+'.2'} placeholder={props.value[1]} />
                                <Form.Text className="text-muted">
                                    {props.field_descriptions[1]}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
            </Col>
            <Col md={2}>
                <Image src='assets/Icons/edit.svg' className='edit_registers_image'  onClick={localEditHandler}/>
            </Col>
            <Col md={2}>
                <Image src='assets/Icons/remove.svg' className='remove_registers_image' onClick={localRemoveHandler}/>
            </Col>
            </Row>
        );
    } else{
        return(
            <Form.Row >
                <Col>
                    <Form.Group>
                        <Form.Label>{props.field_names[0]}</Form.Label>
                        <Form.Control className='twoFields.1' type="text" id={props.register_name+'.1'} placeholder={props.value[0]} />
                        <Form.Text className="text-muted">
                            {props.field_descriptions[0]}
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>{props.field_names[1]}</Form.Label>
                        <Form.Control className='twoFields.2' type="text" id={props.register_name+'.2'} placeholder={props.value[1]} />
                        <Form.Text className="text-muted">
                            {props.field_descriptions[1]}
                        </Form.Text>
                    </Form.Group>
                </Col>
            </Form.Row>
        );
    }



};

export default TwoValuesField;
