import React from 'react';

import Col from "react-bootstrap/Col"
import {Row} from "react-bootstrap";
import InputField from "../UI_elements/InputField";
import {Edit, Trash} from "grommet-icons";


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
                <Edit color='white' onClick={localEditHandler} />
            </Col>
            <Col md={2}>
                <Trash color='white' onClick={localRemoveHandler}/>
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
