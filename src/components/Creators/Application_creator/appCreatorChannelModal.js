import React, {Component} from 'react';

import {Button, FormLayout, InputField} from "../../UI_elements"
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

    handleShow = () => {
        this.setState({name:this.props.init_values.name, min_value:this.props.init_values.min_value, max_value:this.props.init_values.max_value});
    };

    render() {
        return(
            <Modal onHide={this.handleHide} onShow={this.handleShow} show={this.props.modals.app_creator_channel_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Channel Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormLayout>
                        <InputField inline name='name' onChange={this.handleChange} label="Parameter Name"/>
                        <InputField inline name='min_value' onChange={this.handleChange} label="Minimum Value"/>
                        <InputField inline name='max_value' onChange={this.handleChange} label="Maximum Value"/>
                    </FormLayout>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AppCreatorChannelModal);
