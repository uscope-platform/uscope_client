import React, {Component} from 'react';

import Button from "../../UI_elements/Button"
import InputField from "../../UI_elements/InputField";

import {Modal} from "react-bootstrap";
import {hideModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux";
import FormLayout from "../../UI_elements/Layouts/FormLayout";


function mapStateToProps(state) {
    return{
        modals:state.modals
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('peripheral_creator_app_param_modal'))},
    }
};


class PeripheralCreatorPeripheralParametersModal extends Component {
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
            <Modal onHide={this.handleHide} show={this.props.modals.peripheral_creator_app_param_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Peripheral Image choice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormLayout>
                        <InputField inline name='periph_name' onChange={this.handleChange} label="Peripheral Name"/>
                        <InputField inline name='periph_version' onChange={this.handleChange} label="Peripheral Version number"/>
                    </FormLayout>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PeripheralCreatorPeripheralParametersModal);
