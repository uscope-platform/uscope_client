import React, {Component} from 'react';

import {Button, Checkbox, FormLayout, InputField, Label} from "../../UI_elements"

import {Modal} from "react-bootstrap";
import {hideModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux";
import styled from "styled-components";

function mapStateToProps(state) {
    return{
        modals:state.modals,
        peripherals:state.peripherals,
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('app_creator_parameter_modal'))},
    }
};


const ChoicesWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`

class AppCreatorParameterModal extends Component {
    constructor(props){
        super(props);
        this.state = {parameter_name:null, trigger:null, value:null, visible:false};
    }


    handleChange = (event) => {
        if(event.target.name==='visible'){
            this.setState({[event.target.name]:event.target.checked});
        } else{
            this.setState({[event.target.name]:event.target.value});
        }
    };

    handleClose = (event) =>{
        event.preventDefault();
        let parameter = {};
        parameter['visible'] = this.state.visible;
        parameter['parameter_name'] = this.state.parameter_name;
        parameter['parameter_id'] = this.state.parameter_name.replace(' ', '_');
        parameter['trigger'] = this.state.trigger;
        parameter['value'] = this.state.value;
        this.props.done(parameter);
        this.props.hideModal();
    };

    handleHide = () => {
        this.props.hideModal();
    };

    handleShow = () =>{
        this.setState({
            visible:this.props.init_values.visible,
            parameter_name:this.props.init_values.parameter_name,
            trigger:this.props.init_values.trigger,
            value:this.props.init_values.value
        });
    };

    render() {
        return(
            <Modal onHide={this.handleHide} onShow={this.handleShow} show={this.props.modals.app_creator_parameter_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Parameter Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormLayout>
                        <InputField inline name='parameter_name' onChange={this.handleChange} label="Parameter Name"/>
                        <InputField inline name='trigger' onChange={this.handleChange} label="Trigger Name"/>
                        <InputField inline name='value' onChange={this.handleChange} label="Value"/>
                        <ChoicesWrapper>
                            <Label>Visible</Label>
                            <Checkbox name='visible' onChange={this.handleChange}/>
                        </ChoicesWrapper>
                    </FormLayout>


                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AppCreatorParameterModal);
