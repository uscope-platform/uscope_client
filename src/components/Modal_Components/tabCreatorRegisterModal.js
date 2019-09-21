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
        this.state = {reg_direction:'', enable_word_fields:false,single_type_checked:true,words_type_checked:false, reg_type:'single'};
    }


    handleChange = (event) => {
        if(event.target.name==='reg_direction') {
            if(event.target.id==='read'){

                if(this.state.reg_direction.includes('W')){
                    if(event.target.checked){
                        this.setState({reg_direction: 'R/W'});
                    } else {
                        this.setState({reg_direction: 'W'});
                    }

                } else  {
                    this.setState({reg_direction: 'R'});
                }
            } else{
                if(this.state.reg_direction.includes('R')){
                    if(event.target.checked){
                        this.setState({reg_direction: 'R/W'});
                    } else {
                        this.setState({reg_direction: 'R'});
                    }
                } else  {
                    this.setState({reg_direction: 'W'});
                }
            }

        }else if(event.target.name==='reg_type'){
            this.setState({[event.target.name]: event.target.id});
            if(event.target.id==='words'){
                this.setState({enable_word_fields:true});
                this.setState({single_type_checked:false,words_type_checked:true});
            } else{
                this.setState({enable_word_fields:false});
                this.setState({single_type_checked:true,words_type_checked:false});
            }

        }else {
            this.setState({[event.target.name]:event.target.value});
        }

    };

    handleClose = () =>{

        let register = {};
        register['register_name'] = this.state.reg_name;
        register['offset'] = this.state.reg_offset;
        register['description'] = this.state.reg_description;
        register['direction'] = this.state.reg_direction;
        register['register_format'] = this.state.reg_type;
        if(this.state.enable_word_fields){
            let field_names = this.state.field_names.split('\n');
            let field_desc = this.state.field_desc.split('\n');
            register['field_names'] = field_names;
            register['field_descriptions'] = field_desc;
        }
        this.props.done(register);
        this.props.hideModal();
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
                            <Form.Control name='reg_offset' placeholder="Address offset" type="text" onChange={this.handleChange} />
                            <Form.Control name='reg_description' placeholder="Description" type="text" onChange={this.handleChange} />
                            <Form.Group>
                                <Form.Label>Register access capabilities</Form.Label>
                                <Form.Check label="Read" name="reg_direction" type="checkbox" id={'read'} onChange={this.handleChange} />
                                <Form.Check label="Write" name="reg_direction" type="checkbox" id={'write'} onChange={this.handleChange} />
                            </Form.Group>
                            <div>
                                <Form.Label>Register type</Form.Label>
                                <Form.Check name="reg_type" label="single" type="radio" id='single' checked={this.state.single_type_checked} onChange={this.handleChange} />
                                <Form.Check name="reg_type" label="words" type="radio" id='words' checked={this.state.words_type_checked} onChange={this.handleChange} />
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
