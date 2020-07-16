import React, {Component} from 'react';

import {Button, Checkbox, FormLayout, InputField, Label, Select} from "../../UI_elements"

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
        hideModal: () => {dispatch(hideModal('app_creator_peripheral_modal'))},
    }
};


const ChoicesWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`


class AppCreatorPeripheralModal extends Component {
    constructor(props){
        super(props);
        this.state = {proxied:false, accessible:false, base_address:null, proxy_address:null, peripheral_type:Object.entries(this.props.peripherals)[0][0]};
    }


    handleChange = (event) => {
        if(event.target.name==='proxied' || event.target.name==='accessible'){
            this.setState({[event.target.name]:event.target.checked});
        } else{
            this.setState({[event.target.name]:event.target.value});
        }
    };

    handleClose = (event) =>{
        event.preventDefault();
        let peripheral = {};
        peripheral['user_accessible'] = this.state.accessible;
        peripheral['proxied'] = this.state.proxied;
        peripheral['base_address'] = this.state.base_address;
        if(this.state.proxied){
            peripheral['proxy_address'] = this.state.proxy_address;
        }
        peripheral['type'] = 'Registers';
        peripheral['name'] = this.state.peripheral_type;
        peripheral['tab_id'] = this.state.peripheral_type;
        this.props.done(peripheral);
        this.props.hideModal();
    };

    handleHide = () => {
        this.props.hideModal();
    };

    handleShow = () =>{
        this.setState({
            peripheral_type:this.props.init_values.tab_id,
            proxied:this.props.init_values.proxied,
            accessible:this.props.init_values.user_accessible,
            base_address:this.props.init_values.base_address,
            proxy_address:this.props.init_values.proxy_address
        });
    };

    render() {
        return(
            <Modal onHide={this.handleHide} onShow={this.handleShow} show={this.props.modals.app_creator_peripheral_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Peripheral Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormLayout>
                        <ChoicesWrapper>
                            <Label>Peripheral Type</Label>
                            <Select name="peripheral_type" onChange={this.handleChange}>
                                <option value="" hidden>Peripheral type</option>
                                {
                                    Object.entries(this.props.peripherals).map((name,i) => (
                                        <option key={i} >{name[0]}</option>
                                    ))
                                }
                            </Select>
                        </ChoicesWrapper>

                        <InputField inline name='base_address' onChange={this.handleChange} label="Base Address"/>
                        <InputField inline name='proxy_address' onChange={this.handleChange} label="Proxy Address" disabled={!this.state.proxied}/>
                        <ChoicesWrapper>
                            <Label>RTCU proxied peripheral</Label>
                            <Checkbox name='proxied' onChange={this.handleChange}/>
                        </ChoicesWrapper>
                        <ChoicesWrapper>
                            <Label>User accessible</Label>
                            <Checkbox name='accessible' onChange={this.handleChange}/>
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


export default connect(mapStateToProps, mapDispatchToProps)(AppCreatorPeripheralModal);
