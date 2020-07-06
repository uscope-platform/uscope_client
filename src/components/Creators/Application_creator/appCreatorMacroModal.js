import React, {Component} from 'react';

import Button from "../../UI_elements/Button"
import InputField from "../../UI_elements/InputField";

import {Modal} from "react-bootstrap";
import {hideModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux";
import styled from "styled-components";
import FormLayout from "../../UI_elements/FormLayout";

function mapStateToProps(state) {
    return{
        modals:state.modals,
        peripherals:state.peripherals,
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('app_creator_macro_modal'))},
    }
};

class AppCreatorMacroModal extends Component {
    constructor(props){
        super(props);
        this.state = {name:null, trigger:null};
    }


    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
        let macro = {};
        macro['name'] = this.state.name;
        macro['trigger'] = this.state.trigger;
        this.props.done(macro);
        this.props.hideModal();
    };

    handleHide = () => {
        this.props.hideModal();
    };

    handleShow = () => {
        this.setState({name:this.props.init_values.name, trigger:this.props.init_values.trigger});
    };

    render() {
        return(
            <Modal onHide={this.handleHide} onShow={this.handleShow} show={this.props.modals.app_creator_macro_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Macro Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormLayout>
                        <InputField inline name='name' onChange={this.handleChange} label="Parameter Name"/>
                        <InputField inline name='trigger' onChange={this.handleChange} label="Trigger Name"/>
                    </FormLayout>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AppCreatorMacroModal);
