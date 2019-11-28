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
        hideModal: () => {dispatch(hideModal('app_creator_IRV_modal'))},
    }
};


class AppCreatorInitialRegisterModal extends Component {
    constructor(props){
        super(props);
        this.state = {name:props.init_values.name, address:props.init_values.address, value:props.init_values.value};
    }


    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
        let initRegVal = {};
        initRegVal['name'] = this.state.name;
        initRegVal['address'] = this.state.address;
        initRegVal['value'] = this.state.value;
        this.props.done(initRegVal);
        this.props.hideModal();
    };

    handleHide = () => {
        this.props.hideModal();
    };

    handleShow = () => {
        this.setState({name:this.props.init_values.name, address:this.props.init_values.address, value:this.props.init_values.value});
    };

    render() {
        return(
            <Modal onHide={this.handleHide} onShow={this.handleShow} show={this.props.modals.app_creator_IRV_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Channel Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Control inline name='name' placeholder="Register Name (for local display only)" type="text" onChange={this.handleChange} value={this.state.name}/>
                            <Form.Control inline name='address' placeholder="Address" type="integer" onChange={this.handleChange} value={this.state.address}/>
                            <Form.Control inline name='value' placeholder="Value" type="integer" onChange={this.handleChange} value={this.state.value}/>
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


export default connect(mapStateToProps, mapDispatchToProps)(AppCreatorInitialRegisterModal);
