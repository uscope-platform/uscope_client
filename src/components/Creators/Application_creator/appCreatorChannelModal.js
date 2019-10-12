import React, {Component} from 'react';

import {Modal, Button, Form, Col} from "react-bootstrap";
import {hideModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux";

function mapStateToProps(state) {
    return{
        modals:state.modals,
        peripherals:state.peripherals,
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('app_creator_channel_modal'))},
    }
};


class AppCreatorChannelModal extends Component {
    constructor(props){
        super(props);
        this.state = {name:null, min_value:null, max_value:null};
    }


    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
        let channel = {};
        debugger;
        channel['name'] = this.state.name;
        channel['min_value'] = this.state.min_value;
        channel['max_value'] = this.state.max_value;
        channel['enabled'] = false;
        this.props.done(channel);
        this.props.hideModal();
    };

    handleHide = () => {
        this.props.hideModal();
    };

    render() {
        return(
            <Modal onHide={this.handleHide} show={this.props.modals.app_creator_channel_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Channel Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Control inline name='name' placeholder="Parameter Name" type="text" onChange={this.handleChange} />
                            <Form.Control inline name='min_value' placeholder="Minimum Value" type="integer" onChange={this.handleChange} />
                            <Form.Control inline name='max_value' placeholder="Maximum Value" type="integer" onChange={this.handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AppCreatorChannelModal);
