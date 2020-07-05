import React from 'react';

import {Col, Row} from "react-bootstrap";
import InputField from "../UI_elements/InputField";
import {Edit,Trash} from "grommet-icons";

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
                    <Edit color='white' onClick={localEditHandler} />
                </Col>
                <Col md={2}>
                    <Trash color='white' onClick={localRemoveHandler}/>
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
