import React, {Component} from 'react';

import Button from "../../UI_elements/Button"
import InputField from "../../UI_elements/InputField";
import Checkbox from "../../UI_elements/checkbox";

import {Modal} from "react-bootstrap";
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
        hideModal: () => {dispatch(hideModal('app_creator_parameter_modal'))},
    }
};


class AppCreatorParameterModal extends Component {
    constructor(props){
        super(props);
        this.state = {parameter_name:null, trigger:null, value:null, visible:false};
    }


    handleChange = (event) => {
        if(event.target.name==='visible'){
            this.setState({[event.target.name]:event.target.checked});
        } else{
            this.setState({[event.target.name]:event.target.value});
        }
    };

    handleClose = (event) =>{
        event.preventDefault();
        let parameter = {};
        parameter['visible'] = this.state.visible;
        parameter['parameter_name'] = this.state.parameter_name;
        parameter['parameter_id'] = this.state.parameter_name.replace(' ', '_');
        parameter['trigger'] = this.state.trigger;
        parameter['value'] = this.state.value;
        this.props.done(parameter);
        this.props.hideModal();
    };

    handleHide = () => {
        this.props.hideModal();
    };

    handleShow = () =>{
        this.setState({
            visible:this.props.init_values.visible,
            parameter_name:this.props.init_values.parameter_name,
            trigger:this.props.init_values.trigger,
            value:this.props.init_values.value
        });
    };

    render() {
        return(
            <Modal onHide={this.handleHide} onShow={this.handleShow} show={this.props.modals.app_creator_parameter_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Parameter Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputField name='parameter_name' onChange={this.handleChange} label="Parameter Name"/>
                    <InputField name='trigger' onChange={this.handleChange} label="Trigger Name"/>
                    <InputField name='value' onChange={this.handleChange} label="Value"/>
                    <Checkbox name='visible' onChange={this.handleChange} label="Visible"/>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AppCreatorParameterModal);
