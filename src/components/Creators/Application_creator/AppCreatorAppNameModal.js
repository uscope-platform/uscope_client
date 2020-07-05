import React, {Component} from 'react';

import Button from "../../UI_elements/Button"
import {Modal} from "react-bootstrap";
import {hideModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux";
import InputField from "../../UI_elements/InputField";

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
                    <InputField inline name='name' onChange={this.handleChange} label="Application Name"/>
                    <InputField inline name='bitstream' onChange={this.handleChange} label="Bitstream Filename"/>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AppCreatorAppNameModal);
