import React from 'react';
import Image from "../UI_elements/Image";

import {Row, Col} from "react-bootstrap";

import {useSelector} from "react-redux";
import RegisterInputForm from "./RegisterInputForm";


let RegisterTab  = props => {
    const register_values = useSelector(
        state => state.registerValues[props.content.tab_id]
    );

    const register_specs = useSelector(
        state => state.peripherals[props.content.tab_id]
    );

    return(
        <Row>
            <Col md={5}><Image src={props.server.server_url + props.content.image_src} alt='Peripheral diagram' fluid/></Col>
            <Col>
                <RegisterInputForm registers={register_specs.registers} values={register_values} server={props.server} content={props.content}/>
            </Col>
        </Row>
    );
};

export default RegisterTab;
