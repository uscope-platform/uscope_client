import React, {Component} from 'react';

import {Modal, Button, Form, Col} from "react-bootstrap";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";






function mapStateToProps(state) {
    return{
        modals:state.modals,
        plot:state.plot
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('timebase_choice'))},
    }
};



class TimebaseModal extends Component {
    constructor(props){
        super(props);
        this.state = {timebase:"", target:null}
    }

    handleHide = () =>{
        this.props.hideModal();
    };

    handleChange = (event) => {
        this.setState({timebase:event.target.value});
        this.setState({target:event.target.name});
    };

    handleClose = (event) =>{
        event.preventDefault();
        let sample_time = null;
        if(this.state.target === 'timebase'){
            let value = this.state.timebase.replace(' ', '');
            let numeric_value = 0;
            if(isNaN(parseFloat(value[value.length -1]))){
                numeric_value = value.slice(0,value.length-1);
                switch (value[value.length-1]) {
                    case 'M':
                        numeric_value = numeric_value*1e6;
                        break;
                    case 'k':
                    case 'K':
                        numeric_value = numeric_value*1e3;
                        break;
                    case 'm':
                        numeric_value = numeric_value*1e-3;
                        break;
                    case 'u':
                    case 'U':
                        numeric_value = numeric_value*1e-6;
                        break;
                    default:
                        break;
                }
            } else{
                numeric_value = parseFloat(value);
            }
            sample_time =  numeric_value/this.props.plot.parameters.memory_depth;
        } else if(this.state.target ==="sample_rate"){
            let value = this.state.timebase.replace(' ', '');
            let numeric_value = 0;
            if(isNaN(parseFloat(value[value.length -1]))){
                numeric_value = value.slice(0,value.length-1);
                switch (value[value.length-1]) {
                    case 'M':
                        numeric_value = numeric_value*1e6;
                        break;
                    case 'k':
                    case 'K':
                        numeric_value = numeric_value*1e3;
                        break;
                    case 'm':
                        numeric_value = numeric_value*1e-3;
                        break;
                    case 'u':
                    case 'U':
                        numeric_value = numeric_value*1e-6;
                        break;
                    default:
                        break;
                }
            } else{
                numeric_value = parseFloat(value);
            }
            sample_time =  1/numeric_value;
        }
        debugger;
        if(sample_time===null){
            alert("the chosen value is invalid");
            this.props.hideModal();
            return;
        }
        this.props.server.plot_proxy.setTimebase({name:'uscope_timebase_change',value:sample_time});
        this.props.hideModal();
    };

    render() {
        return(
            <Modal onHide={this.handleHide} show={this.props.modals.timebase_choice}>
                <Modal.Header closeButton>
                    <Modal.Title>Timebase Control</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Label>Overall timebase length</Form.Label>
                            <Form.Control name="timebase" type="text" onChange={this.handleChange} />
                            <Form.Label>ADC sampling Rate</Form.Label>
                            <Form.Control name="sample_rate" type="text" onChange={this.handleChange} />
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


export default connect(mapStateToProps, mapDispatchToProps)(TimebaseModal);
