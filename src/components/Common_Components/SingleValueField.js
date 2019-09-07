import React, {Component} from 'react';

import Form from "react-bootstrap/Form";



class SingleValueField extends Component {

    render() {
        return(
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{this.props.field.name}</Form.Label>
                <Form.Control type="text" placeholder={this.props.field.default_value} />
                <Form.Text className="text-muted">
                    {this.props.field.description}
                </Form.Text>
            </Form.Group>
        );
    }

}

export default SingleValueField;
