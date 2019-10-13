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
        hideModal: () => {dispatch(hideModal('app_creator_app_name_modal'))},
    }
};


class AppCreatorAppNameModal extends Component {
    constructor(props){
        super(props);
        this.state = {name:null, bitstream:null};
    }


    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
        let app = {};
        app['name'] = this.state.name;
        app['bitstream'] = this.state.bitstream;
        this.props.done(app);
        this.props.hideModal();
    };

    handleHide = () => {
        this.props.hideModal();
    };

    render() {
        return(
            <Modal onHide={this.handleHide} show={this.props.modals.app_creator_app_name_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Channel Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Control inline name='name' placeholder="Application Name" type="text" onChange={this.handleChange} />
                            <Form.Control inline name='bitstream' placeholder="Bitstream Filename" type="integer" onChange={this.handleChange} />
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


export default connect(mapStateToProps, mapDispatchToProps)(AppCreatorAppNameModal);
