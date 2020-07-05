import React from 'react';

import {Col, Image, Row} from "react-bootstrap";
import InputField from "../UI_elements/InputField";

let SingleValueField = props => {


    let localRemoveHandler = () =>{
        props.handle_remove(props.name);
    };

    let localEditHandler = () =>{
        props.handle_edit(props.regID);
    };


    if(props.preview_only){
        return(
            <Row>
                <Col fluid={true}>
                    <InputField description={props.description} name={props.name} label={props.name}/>
                </Col>
                <Col md={2}>
                    <Image src='assets/Icons/edit.svg' className='edit_registers_image'  onClick={localEditHandler}/>
                </Col>
                <Col md={2}>
                    <Image src='assets/Icons/remove.svg' className='remove_registers_image'  onClick={localRemoveHandler}/>
                </Col>
            </Row>
        );
    } else{
        return(
            <InputField description={props.description} name={props.name} label={props.name}/>
        );
    }
};

export default SingleValueField;
