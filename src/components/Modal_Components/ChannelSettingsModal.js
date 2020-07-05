import React, {Component} from 'react';

import Button from "../UI_elements/Button"
import {Modal} from "react-bootstrap";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";
import InputField from "../UI_elements/InputField";


function mapStateToProps(state) {
    return{
        modals:state.modals,
        plot:state.plot
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: (id) => {dispatch(hideModal('channel_settings_choice', id))},
    }
};


class ChannelSettingsModal extends Component {
    constructor(props){
        super(props);
        this.state = {min_value:"", max_value:""}
    }


    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
        let min = parseFloat(this.state.min_value);
        let max = parseFloat(this.state.max_value);

        this.props.server.app_proxy.setChannelLimits(min, max, this.props.id);

        this.props.hideModal(this.props.id);
    };

    handleHide = (event) =>{
        this.props.hideModal(this.props.id);
    };

    render() {
        return(
            <Modal onHide={this.handleHide} show={this.props.modals.channel_settings_choice[this.props.id]}>
                <Modal.Header closeButton>
                    <Modal.Title>Application Choice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputField inline name='min_value' onChange={this.handleChange} label="Minimum Value"/>
                    <InputField inline name='max_value' onChange={this.handleChange} label="Maximum value"/>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}




export default connect(mapStateToProps, mapDispatchToProps)(ChannelSettingsModal);
