import React, {Component} from 'react';

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col"


class TwoValuesField extends Component {

    render() {
        return(

            <Form.Row>
                <Col>
                    <Form.Group controlId="first_input">
                        <Form.Label>{this.props.field.name[0]}</Form.Label>
                        <Form.Control type="text" placeholder={this.props.field.default_value[0]} />
                        <Form.Text className="text-muted">
                            {this.props.field.description[0]}
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="second_input">
                        <Form.Label>{this.props.field.name[1]}</Form.Label>
                        <Form.Control type="text" placeholder={this.props.field.default_value[1]} />
                        <Form.Text className="text-muted">
                            {this.props.field.description[1]}
                        </Form.Text>
                    </Form.Group>
                </Col>
            </Form.Row>


        );
    }

}

export default TwoValuesField;
