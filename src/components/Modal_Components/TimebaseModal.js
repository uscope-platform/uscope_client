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
        this.state = {timebase:""}
    }

    handleHide = () =>{
        this.props.hideModal();
    }

    handleChange = (event) => {
        this.setState({timebase:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
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

        let sample_time =  numeric_value/this.props.plot.parameters.memory_depth;
        this.props.server.plot_proxy.setTimebase({name:'uscope_timebase_change',value:sample_time});
        this.props.hideModal();
    };

    render() {
        return(
            <Modal onHide={this.handleHide} show={this.props.modals.timebase_choice}>
                <Modal.Header closeButton>
                    <Modal.Title>Application Choice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Label>State</Form.Label>
                            <Form.Control type="text" onChange={this.handleChange} />
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
