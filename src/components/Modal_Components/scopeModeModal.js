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
        hideModal: () => {dispatch(hideModal('scope_mode_choice'))},
    }
};


class ScopeModeModal extends Component {
    constructor(props){
        super(props);
        this.state = {selected_mode:""}
    }


    handleChange = (event) => {
        this.setState({selected_mode:event.target.id});
    };

    handleClose = (event) =>{
        event.preventDefault();
        debugger;
        this.props.hideModal();
    };

    handleHide = () =>{
        this.props.hideModal();
    }

    render() {
        return(
            <Modal onHide={this.handleHide} show={this.props.modals.scope_mode_choice}>
                <Modal.Header closeButton>
                    <Modal.Title>Application Choice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Check type='radio' id={'single'} label={'Single Capture'} onChange={this.handleChange}/>
                        <Form.Check type='radio' id={'run'} label={'Run'} onChange={this.handleChange}/>

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ScopeModeModal);
