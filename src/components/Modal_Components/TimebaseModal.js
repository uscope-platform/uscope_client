import React, {Component} from 'react';

import {Modal, Button, Form, Col} from "react-bootstrap";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";
import {saveScriptsWorkspace} from '../../redux/Actions/scriptsActions';

function mapStateToProps(state) {
    return{
        modals: state.modals,
        plot: state.plot,
        applications: state.applications,
        settings: state.settings,
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('timebase_choice'))},
        setWorkspaceVariable: (variable) => dispatch(saveScriptsWorkspace(variable))
    }
};



class TimebaseModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            target: null,
            n_enables: this.props.applications[this.props.settings['application']]['n_enables'],
            clock_frequency:this.props.applications[this.props.settings['application']]['clock_frequency']
        }
    }

    handleHide = () =>{
        this.props.hideModal();
    };

    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value});
    };


    parse_number = (raw_value) =>{
        let numeric_value = 0;
        if(isNaN(parseFloat(raw_value[raw_value.length -1]))){
            numeric_value = raw_value.slice(0,raw_value.length-1);
            switch (raw_value[raw_value.length-1]) {
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

            numeric_value = Math.round(this.state.clock_frequency/parseFloat(raw_value));
        }
        this.props.setWorkspaceVariable({fsw:parseFloat(raw_value)});
        return numeric_value

    };


    handleClose = (event) =>{
        event.preventDefault();
        let value = this.state.frequency.replace(' ', '');

        debugger;

        let timebase_reg = {};
        timebase_reg['name'] = 'freq';
        timebase_reg['peripheral'] = 'enable_generator';
        timebase_reg['value'] =this.parse_number(value);

        let phases = Array.from({length: this.state.n_enables}, (x,i) => i).map((reg, i) => {
            let ret_val = {};
            ret_val['name'] = 'pha_'+(i+1);
            ret_val['peripheral'] = 'enable_generator';
            ret_val['value'] = Math.round(parseFloat(this.state['enable_'+(i+1)].replace(' ', ''))*timebase_reg.value);
            return ret_val;
        });

        this.props.server.periph_proxy.setRegisterValue(timebase_reg);

        // eslint-disable-next-line
        for(let i of phases){
            this.props.server.periph_proxy.setRegisterValue(i);
        }

        this.props.hideModal();
    };

    generate_form = (label) => {
        return(
            <Form.Group key={label} as={Col}>
                <Form.Label>{label}</Form.Label>
                <Form.Control name={label} type="text" onChange={this.handleChange} />
            </Form.Group>
        );

    };

    render() {
        return(
            <Modal onHide={this.handleHide} show={this.props.modals.timebase_choice}>
                <Modal.Header closeButton>
                    <Modal.Title>Application timebase Control</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Label>Frequency</Form.Label>
                            <Form.Control name="frequency" type="text" onChange={this.handleChange} />
                        </Form.Group>
                        {
                            Array.from({length: this.state.n_enables}, (x,i) => i).map((reg, i) => {
                                    return this.generate_form('enable_'+(i+1));
                            })
                        }
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
