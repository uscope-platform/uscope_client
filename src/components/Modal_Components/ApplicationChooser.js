import React, {Component} from 'react';

import {Modal, Button, Form, Col} from "react-bootstrap";
import {connect} from "react-redux";

function mapStateToProps(state) {
    return{
        applications:state.applications
    }
}

class ApplicationChooser extends Component {
    constructor(props){
        super(props);
        this.applications_list = [];
        // eslint-disable-next-line
        for (let item in this.props.applications){
            this.applications_list.push(item);
        }
        this.state = {chosen_application:this.applications_list[0]}
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
                            <Form.Label>Application Name</Form.Label>
                            <Form.Control as="select" onChange={this.handleChange}>
                                <option>Chose An Application</option>
                                {this.applications_list.map((name,i) => (
                                    <option key={i} >{name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}


export default connect(mapStateToProps)(ApplicationChooser);
