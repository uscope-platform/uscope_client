import React, {Component} from 'react';

import Button from "../../UI_elements/Button"
import {Modal} from "react-bootstrap";
import {hideModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux";
import FileChoice from "../../UI_elements/FileChoice";

function mapStateToProps(state) {
    return{
        modals:state.modals
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('peripheral_creator_image_choice'))},
    }
};


class PeripheralCreatorImageChooser extends Component {
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
            <Modal onHide={this.handleHide} show={this.props.modals.peripheral_creator_image_choice}>
                <Modal.Header closeButton>
                    <Modal.Title>Peripheral Image choice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FileChoice label={"Choose an image"} onChange={this.handleChange}/>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PeripheralCreatorImageChooser);
