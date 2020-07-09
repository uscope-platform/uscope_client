import React, {Component} from 'react';

import Button from "../UI_elements/Button"
import {Modal} from "react-bootstrap";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";
import InputField from "../UI_elements/InputField";
import FormLayout from "../UI_elements/Layouts/FormLayout";


function mapStateToProps(state) {
    return{
        modals:state.modals,
        plot:state.plot
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('scope_mode_choice'))},
    }
};


class ScopeModeModal extends Component {
    constructor(props){
        super(props);
        this.state = {n_buffers:"", visible:false}
    }


    handleChange = (event) => {
        this.setState({n_buffers:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
        this.props.done(this.state.n_buffers);
        this.props.hideModal();
    };

    handleHide = () =>{
        this.props.hideModal();
    };

    render() {
        return(
            <Modal onHide={this.handleHide} show={this.props.modals.scope_mode_choice}>
                <Modal.Header closeButton>
                    <Modal.Title>Select the number of buffers to capture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormLayout>
                        <InputField inline name='n_buffers' onChange={this.handleChange} label="Number of buffers"/>
                    </FormLayout>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ScopeModeModal);
