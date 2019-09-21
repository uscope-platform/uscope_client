import React from 'react';

import {Row, Col, Image} from "react-bootstrap";

import {useSelector} from "react-redux";
import RegisterInputForm from "./RegisterInputForm";


let RegisterTab  = props => {
    const registers = useSelector(
        state => state.registerValues[props.content.tab_id]
    );

    return(
        <Row>
            <Col md={5}><Image src={props.server.server_url + props.content.image_src} alt='ADC processing block diagram' fluid/></Col>
            <Col>
                <RegisterInputForm registers={registers} server={props.server} content={props.content}/>
            </Col>
        </Row>
    );
};

export default RegisterTab;
