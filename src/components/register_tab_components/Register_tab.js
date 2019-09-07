import React, {Component} from 'react';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import SingleValueField from "../Common_Components/SingleValueField";
import TwoValuesField from "../Common_Components/TwoValuesField";

class RegisterTab extends Component {

    render() {
        return(
            <Container>
                <Row>
                    <Col md={5}><Image src={this.props.content.image_src} alt='ADC processing block diagram' fluid/></Col>
                    <Col>
                        <Form>
                            {this.props.content.registers.map((reg) => {
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
    }

}

export default RegisterTab;
