import React, {Component} from 'react';

import {Modal, Button, Form} from "react-bootstrap";
import {hideModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux";


function mapStateToProps(state) {
    return{
        modals:state.modals
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('peripheral_creator_register_modal'))},
    }
};


class PeripheralCreatorRegisterModal extends Component {
    constructor(props){
        super(props);
        this.state = {reg_direction:'', enable_word_fields:false, read_checked:true, write_checked:true, single_type_checked:true, words_type_checked:false, reg_type:'single'};
    }


    handleChange = (event) => {
        if(event.target.name==='reg_direction') {
            if(event.target.id==='read'){
                this.setState({read_checked:event.target.checked})
            } else{
                this.setState({write_checked:event.target.checked})
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

        if(this.state.read_checked && this.state.write_checked){
            register['direction'] = "R/W";
        } else if(this.state.write_checked){
            register['direction'] = "W";
        } else if(this.state.read_checked){
            register['direction'] = "R";
        }

        register['ID'] = this.state.reg_ID;
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

    handleShow = () => {
        debugger;
        if(this.props.initial_values === undefined){
            this.setState({
                reg_name:"",
                reg_offset:"",
                reg_description:"",
                write_checked:false,
                read_checked:false,
                reg_ID:"",
                single_type_checked:true,
                words_type_checked:false,
                enable_word_fields:false,
                field_names:"",
                field_desc:""
            });
        } else {
            let descriptions = null;
            let names = null;
            if(this.props.initial_values.field_descriptions !== undefined){
                descriptions = this.props.initial_values.field_descriptions.reduce((next, current)=>{
                    return current + '\n' + next;
                });
                names = this.props.initial_values.field_names.reduce((next, current)=>{
                    return current + '\n' + next;
                });
            }
            this.setState({
                reg_name:this.props.initial_values.register_name,
                reg_offset:this.props.initial_values.offset,
                reg_description:this.props.initial_values.description,
                write_checked:this.props.initial_values.direction.includes('W'),
                read_checked:this.props.initial_values.direction.includes('R'),
                reg_ID:this.props.initial_values.ID,
                single_type_checked:this.props.initial_values.register_format ==='single',
                words_type_checked:this.props.initial_values.register_format ==='words',
                enable_word_fields:this.props.initial_values.register_format ==='words',
                field_names:names,
                field_desc:descriptions
            });
        }
    };

    render() {

        return(
            <Modal onHide={this.handleHide} onShow={this.handleShow} show={this.props.modals.peripheral_creator_register_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control inline name='reg_name' placeholder="Register Name" type="text" value={this.state.reg_name} onChange={this.handleChange} />
                            <Form.Control inline name='reg_ID' placeholder="Register ID" type="text" value={this.state.reg_ID}  onChange={this.handleChange} />
                            <Form.Control name='reg_offset' placeholder="Address offset" type="text" value={this.state.reg_offset}  onChange={this.handleChange} />
                            <Form.Control name='reg_description' placeholder="Description" type="text" value={this.state.reg_description} onChange={this.handleChange} />
                            <Form.Group>
                                <Form.Label>Register access capabilities</Form.Label>
                                <Form.Check label="Read" name="reg_direction" type="checkbox" id={'read'} checked={this.state.read_checked} onChange={this.handleChange} />
                                <Form.Check label="Write" name="reg_direction" type="checkbox" id={'write'} checked={this.state.write_checked} onChange={this.handleChange} />
                            </Form.Group>
                            <div>
                                <Form.Label>Register type</Form.Label>
                                <Form.Check name="reg_type" label="single" type="radio" id='single' checked={this.state.single_type_checked} onChange={this.handleChange} />
                                <Form.Check name="reg_type" label="words" type="radio" id='words' checked={this.state.words_type_checked} onChange={this.handleChange} />
                            </div>
                            <Form.Group>
                                <Form.Label>Field Names</Form.Label>
                                <Form.Control disabled={!this.state.enable_word_fields} name="field_names" value={this.state.field_names} label="Field Names" as="textarea" rows={2} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Field descriptions</Form.Label>
                                <Form.Control disabled={!this.state.enable_word_fields} name="field_desc" value={this.state.field_desc} label="Field Descriptions" as="textarea" rows={2} onChange={this.handleChange} />
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


export default connect(mapStateToProps, mapDispatchToProps)(PeripheralCreatorRegisterModal);
