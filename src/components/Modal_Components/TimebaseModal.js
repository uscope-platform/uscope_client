import React, {Component} from 'react';

import {Modal, Button, Form, Col} from "react-bootstrap";


class TimebaseModal extends Component {
    constructor(props){
        super(props);
        this.state = {timebase:""}
    }


    handleChange = (event) => {
        this.setState({timebase:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
        let timebase = this.state.timebase;
        this.props.done(timebase);
    };

    render() {
        return(
            <Modal show={this.props.show}>
                <Modal.Header closeButton>
                    <Modal.Title>Application Choice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Label>State</Form.Label>
                            <Form.Control type="text" onChange={this.handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={this.handleClose}>Save changes</Button>
                    </Form>
                </Modal.Body>

                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        );
    }
}


export default TimebaseModal;
