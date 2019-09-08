import React from 'react';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import SingleValueField from "../Common_Components/SingleValueField";
import TwoValuesField from "../Common_Components/TwoValuesField";
import {useDispatch, useSelector} from "react-redux";
import {setSingleValueRegister, setTwoValueRegister} from "../../redux/Actions/RegisterActions";

let RegisterTab  = props => {
    const registers = useSelector(
        state => state.registerValues[props.content.tab_id]
    );

    const dispatch = useDispatch();

    const handleSubmit = event => {
        event.preventDefault();
        for(let register of event.target){ // eslint-disable-line no-unused-vars
            let objIndex = registers.findIndex((obj => obj.qualified_name === register.name));
            if(register.className.includes("oneField")){
                let intValue = parseFloat(register.value);
                if(register.value!=="" && registers[objIndex].value !==intValue){
                    dispatch(setSingleValueRegister(register.name, intValue, props.content.tab_id));
                }
            }else if (register.className.includes("twoFields")){
                for(let item of register.classList){ // eslint-disable-line no-unused-vars
                    if(item.includes("twoFields")){
                        let idx = parseInt(item.replace("twoFields.",''));
                        let intValue = {idx:idx,value:parseFloat(register.value)};
                        dispatch(setTwoValueRegister(register.id, intValue, props.content.tab_id));
                    }
                }

            }
        }
    };

    return(
        <Container>
            <Row>
                <Col md={5}><Image src={props.content.image_src} alt='ADC processing block diagram' fluid/></Col>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        {registers.map((reg) => {
                            if(reg.type === "single"){
                                return(
                                    <SingleValueField field={reg}/>
                                );
                            } else if(reg.type==='two'){
                                return(
                                    <TwoValuesField field={reg}/>
                                );
                            } else return(<p>invalid form field</p>);
                        })}
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterTab;
