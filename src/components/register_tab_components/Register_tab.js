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

function arraysEqual(a,b) {
/*
    Array-aware equality checker:
    Returns whether arguments a and b are == to each other;
    however if they are equal-lengthed arrays, returns whether their
    elements are pairwise == to each other recursively under this
    definition.
*/
if (a instanceof Array && b instanceof Array) {
    // eslint-disable-next-line
    if (a.length!=b.length)
        return false;
    for(var i=0; i<a.length; i++)  // assert each element equal
        if (!arraysEqual(a[i],b[i]))
            return false;
    return true;
} else {
    // eslint-disable-next-line
    return a==b;  // if not both arrays, should be the same
}
}

let RegisterTab  = props => {
    const registers = useSelector(
        state => state.registerValues[props.content.tab_id]
    );

    const dispatch = useDispatch();

    const handleSubmit = event => {
        event.preventDefault();
        let first_field_value = null;
        for(let register of event.target){ // eslint-disable-line no-unused-vars
            if(register.className.includes("oneField")){
                let idx = registers.findIndex((obj => obj.qualified_name === register.name));
                let intValue = parseFloat(register.value);
                if(register.value!=="" && registers[idx].value !==intValue){
                    dispatch(setSingleValueRegister(register.name, intValue, props.content.tab_id));
                }
            }else if (register.className.includes("twoFields")){
                for(let item of register.classList){ // eslint-disable-line no-unused-vars
                    if(item.includes("twoFields")){
                        let reg_idx = registers.findIndex((obj => obj.qualified_name === register.id));
                        let fld_idx = parseInt(item.replace("twoFields.",''));
                        let currentValue = parseInt(register.value);
                        if(fld_idx===1){
                            first_field_value = currentValue;
                        }else if(fld_idx===2){
                            currentValue = [first_field_value, currentValue];
                            if(register.value!=="" && !arraysEqual( registers[reg_idx].value, currentValue)) {
                                dispatch(setTwoValueRegister(register.id, currentValue, props.content.tab_id));
                            }
                        }

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
