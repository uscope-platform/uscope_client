import React, {Component} from 'react';

import Button from "../../UI_elements/Button"
import {Modal} from "react-bootstrap";
import {hideModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux";
import InputField from "../../UI_elements/InputField";
import Checkbox from "../../UI_elements/checkbox";
import Label from "../../UI_elements/Label";
import Radio from "../../UI_elements/Radio";
import TextArea from "../../UI_elements/TextArea";

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
        if(event.target.name==='reg_direction_read') {
            this.setState({read_checked: event.target.checked});
        }
        if(event.target.name==='reg_direction_read') {
            this.setState({write_checked: event.target.checked})
        }
        if(event.target.name==='reg_type'){
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
                    <InputField inline name='reg_name' onChange={this.handleChange} label="Register Name"/>
                    <InputField inline name='reg_ID' onChange={this.handleChange} label="Register ID"/>
                    <InputField inline name='reg_offset' onChange={this.handleChange} label="Address offset"/>
                    <InputField inline name='reg_description' onChange={this.handleChange} label="Description"/>
                    <div>
                        <Label>Register access capabilities</Label>
                        <Checkbox name='reg_direction_read' onChange={this.handleChange} label="Read"/>
                        <Checkbox name='reg_direction_write' onChange={this.handleChange} label="Write"/>
                    </div>
                    <div>
                        <Label>Register type</Label>
                        <Radio name="reg_type"  onChange={this.handleChange} label="single" id='single'/>
                        <Radio name="reg_type" onChange={this.handleChange} label="words" id='words'/>
                    </div>
                    <div>
                        <Label>Field Names</Label>
                        <TextArea disabled={!this.state.enable_word_fields} name="field_names" label="Field Names" rows={2}  onChange={this.handleChange}/>
                    </div>
                    <div>
                        <Label>Field descriptions</Label>
                        <TextArea disabled={!this.state.enable_word_fields} name="field_desc" label="Field Descriptions" rows={2}  onChange={this.handleChange}/>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PeripheralCreatorRegisterModal);
