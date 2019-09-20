import React, {Component} from 'react';

import {Modal, Button, Form} from "react-bootstrap";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";


function mapStateToProps(state) {
    return{
        modals:state.modals
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('tab_creator_register_modal'))},
    }
};


class TabCreatorRegisterModal extends Component {
    constructor(props){
        super(props);
        this.state = {enable_word_fields:false};
    }


    handleChange = (event) => {
        debugger;
        if(event.target.name==='reg_direction') {
            this.setState({[event.target.name]: event.target.id});
        }else if(event.target.name==='reg_type'){
            this.setState({[event.target.name]: event.target.id});
            if(event.target.id==='words'){
                this.setState({enable_word_fields:true})
            } else{
                this.setState({enable_word_fields:false})
            }

        }else {
            this.setState({[event.target.name]:event.target.value});
        }

    };

    handleClose = (event) =>{

    };

    handleHide = () => {
        this.props.hideModal();
    };

    render() {

        return(
            <Modal onHide={this.handleHide} show={this.props.modals.tab_creator_register_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control inline name='reg_name' placeholder="Register Name" type="text" onChange={this.handleChange} />
                            <Form.Group>
                                <Form.Label>Register access capabilities</Form.Label>
                                <Form.Check label="Read" name="reg_direction" type="checkbox" id={'read'} onChange={this.handleChange} />
                                <Form.Check label="Write" name="reg_direction" type="checkbox" id={'write'} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Control name='reg_offset' placeholder="Address offset" type="text" onChange={this.handleChange} />
                            <div>
                                <Form.Label>Register type</Form.Label>
                                <Form.Check name="reg_type" label="single" type="radio" id='single' onChange={this.handleChange} />
                                <Form.Check name="reg_type" label="words" type="radio" id='words' onChange={this.handleChange} />
                            </div>
                            <Form.Group>
                                <Form.Label>Field Names</Form.Label>
                                <Form.Control disabled={!this.state.enable_word_fields} name="field_names" label="Field Names" as="textarea" rows={2} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Field descriptions</Form.Label>
                                <Form.Control disabled={!this.state.enable_word_fields} name="field_desc" label="Field Descriptions" as="textarea" rows={2} onChange={this.handleChange} />
                            </Form.Group>
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


export default connect(mapStateToProps, mapDispatchToProps)(TabCreatorRegisterModal);
