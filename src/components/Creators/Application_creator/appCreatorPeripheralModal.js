import React, {Component} from 'react';

import {Modal, Button, Form, Col} from "react-bootstrap";
import {hideModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux";

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

    render() {
        return(
            <Modal onHide={this.handleHide} show={this.props.modals.app_creator_peripheral_modal}>
                <Modal.Header closeButton>
                    <Modal.Title>Peripheral Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Group>
                                <Form.Label> Peripheral type</Form.Label>
                                <Form.Control name="peripheral_type" as="select" onChange={this.handleChange}>
                                    {
                                        Object.entries(this.props.peripherals).map((name,i) => (
                                            <option key={i} >{name[0]}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Control inline name='base_address' placeholder="Base Address" type="text" onChange={this.handleChange} />
                            <Form.Control inline name='proxy_address' placeholder="Proxy Address" type="text" value={this.state.proxy_address} disabled={!this.state.proxied} onChange={this.handleChange} />
                            <Form.Check label="RTCU proxied peripheral" name="proxied" type="checkbox" id={'proxied'} value={this.state.proxied}  onChange={this.handleChange} />
                            <Form.Check label="User accessible" name="accessible" type="checkbox" id="accessible" value={this.state.accessible} onChange={this.handleChange} />
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


export default connect(mapStateToProps, mapDispatchToProps)(AppCreatorPeripheralModal);
