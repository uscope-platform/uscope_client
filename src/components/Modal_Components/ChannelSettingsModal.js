import React, {Component} from 'react';

import {Modal, Button, Form} from "react-bootstrap";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";


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
                    <Form>
                        <Form.Group>
                            <Form.Label>Minimum Value</Form.Label>
                            <Form.Control name='min_value' placeholder={this.props.plot.settings[this.props.id].min_value} type="text" onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Maximum value</Form.Label>
                            <Form.Control name='max_value' placeholder={this.props.plot.settings[this.props.id].max_value} type="text" onChange={this.handleChange} />
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




export default connect(mapStateToProps, mapDispatchToProps)(ChannelSettingsModal);
