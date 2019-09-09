import React, {Component} from 'react';

import {Modal, Button, Form, Col} from "react-bootstrap";


class ApplicationChooser extends Component {
    constructor(props){
        super(props);
        this.state = {chosen_application:props.applications[0]}
    }


    handleChange = (event) => {
        this.setState({chosen_application:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
        let app = this.state.chosen_application;
        this.props.done(app);
    };

    render() {
        return(
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Application Choice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Label>State</Form.Label>
                            <Form.Control as="select" onChange={this.handleChange}>
                                <option>Chose An Application</option>
                                {this.props.applications.map((size,i) => (
                                    <option key={i} >{size}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={this.handleClose}>Save changes</Button>
                    </Form>
                </Modal.Body>

                <Modal.Footer>

                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}


export default ApplicationChooser;
