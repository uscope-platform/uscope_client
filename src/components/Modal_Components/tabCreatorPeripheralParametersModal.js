import React, {Component} from 'react';

import {Modal, Button, Form, Col} from "react-bootstrap";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";

function mapStateToProps(state) {
    return{
        modals:state.modals
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('tab_creator_app_param_modal'))},
    }
};


class TabCreatorPeripheralParametersModal extends Component {
    constructor(props){
        super(props);
        this.state = {periph_name:null, periph_version:null};
    }


    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
        if(this.state.periph_name){
            this.props.done({name: this.state.periph_name, version:this.state.periph_version});
            this.props.hideModal();
        }
    };

    handleHide = () => {
        this.props.hideModal();
    };

    render() {

        return(
            <Modal onHide={this.handleHide} show={this.props.modals.tab_creator_app_param_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Peripheral Image choice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Control inline name='periph_name' placeholder="Peripheral Name" type="text" onChange={this.handleChange} />
                            <Form.Control inline name='periph_version' placeholder="Peripheral Version number" type="text" onChange={this.handleChange} />
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


export default connect(mapStateToProps, mapDispatchToProps)(TabCreatorPeripheralParametersModal);
