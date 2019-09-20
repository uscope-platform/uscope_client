import React, {Component} from 'react';

import {Modal, Button, Form, Col} from "react-bootstrap";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";
import axios from 'axios'
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
        let formData = new FormData();
        formData.append("file", this.state.chosenImage, this.state.chosenImage.name);

        axios({
            method: 'post',
            url: this.props.server.server_url+'tab_creator/diagram',
            data: formData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        }).catch(function (response) {
            //handle error
            console.log(response);
        });
        this.props.done(this.state.chosenImage);
        this.props.hideModal();
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
