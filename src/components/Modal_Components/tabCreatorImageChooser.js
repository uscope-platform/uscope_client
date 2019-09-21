import React, {Component} from 'react';

import {Modal, Button, Form, Col} from "react-bootstrap";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";

function mapStateToProps(state) {
    return{
        modals:state.modals
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('tab_creator_image_choice'))},
    }
};


class TabCreatorImageChooser extends Component {
    constructor(props){
        super(props);
        this.state = {chosenImage:null};
    }


    handleChange = (event) => {
        this.setState({chosenImage:event.target.files[0]});
    };

    handleClose = (event) =>{
        event.preventDefault();
        if(this.state.chosenImage){
            this.props.done(this.state.chosenImage);
            this.props.hideModal();
        }
    };

    handleHide = () => {
        this.props.hideModal();
    };

    render() {

        return(
            <Modal onHide={this.handleHide} show={this.props.modals.tab_creator_image_choice}>
                <Modal.Header closeButton>
                    <Modal.Title>Peripheral Image choice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Label>Choose an image</Form.Label>
                            <Form.Control as="input" type='file' onChange={this.handleChange}/>
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


export default connect(mapStateToProps, mapDispatchToProps)(TabCreatorImageChooser);
