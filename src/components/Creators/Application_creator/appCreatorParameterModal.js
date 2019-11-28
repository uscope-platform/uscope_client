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
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Control inline name='parameter_name' placeholder="Parameter Name" type="text" onChange={this.handleChange} value={this.state.parameter_name}/>
                            <Form.Control inline name='trigger' placeholder="Trigger Name" type="text" onChange={this.handleChange} value={this.state.trigger}/>
                            <Form.Control inline name='value' placeholder="Value" type="text" onChange={this.handleChange} value={this.state.value}/>
                            <Form.Check label="visible" name="visible" type="checkbox" id="visible" checked={this.state.visible} onChange={this.handleChange}/>
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


export default connect(mapStateToProps, mapDispatchToProps)(AppCreatorParameterModal);
