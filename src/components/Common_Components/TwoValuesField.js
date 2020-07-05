import React from 'react';

import Col from "react-bootstrap/Col"
import {Image, Row} from "react-bootstrap";
import InputField from "../UI_elements/InputField";


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
                            <InputField description={props.field_descriptions[0]} name={props.register_name+'.1'} label={props.field_names[0]}/>
                        </Col>
                        <Col>
                            <InputField description={props.field_descriptions[1]} name={props.register_name+'.2'} label={props.field_names[1]}/>
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
            <Row >
                <Col>
                    <InputField description={props.field_descriptions[0]} name={props.register_name+'.1'} label={props.field_names[0]}/>
                </Col>
                <Col>
                    <InputField description={props.field_descriptions[1]} name={props.register_name+'.2'} label={props.field_names[1]}/>
                </Col>
            </Row>
        );
    }



};

export default TwoValuesField;
