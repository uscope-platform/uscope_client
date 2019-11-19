import React, {Component} from 'react';

import {Modal, Button, Form} from "react-bootstrap";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";


function mapStateToProps(state) {
    return{
        modals:state.modals,
        plot:state.plot
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('scope_mode_choice'))},
    }
};


class ScopeModeModal extends Component {
    constructor(props){
        super(props);
        this.state = {n_buffers:""}
    }


    handleChange = (event) => {
        this.setState({n_buffers:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
        this.props.done(this.state.n_buffers);
        this.props.hideModal();
    };

    handleHide = () =>{
        this.props.hideModal();
    };

    render() {
        return(
            <Modal onHide={this.handleHide} show={this.props.modals.scope_mode_choice}>
                <Modal.Header closeButton>
                    <Modal.Title>Select the number of buffers to capture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleClose}>
                        <Form.Label>Number of buffers</Form.Label>
                        <Form.Control name="n_buffers" type="text" onChange={this.handleChange} />

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ScopeModeModal);
