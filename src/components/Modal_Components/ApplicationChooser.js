import React, {Component} from 'react';

import Button from "../UI_elements/Button"
import {Modal} from "react-bootstrap";
import {connect} from "react-redux";
import Select from "../UI_elements/Select";
import FormLayout from "../UI_elements/FormLayout";
import Label from "../UI_elements/Label";

function mapStateToProps(state) {
    return{
        applications:state.applications
    }
}

class ApplicationChooser extends Component {
    constructor(props){
        super(props);
        this.applications_list = [];
        // eslint-disable-next-line
        for (let item in this.props.applications){
            this.applications_list.push(item);
        }
        this.state = {chosen_application:this.applications_list[0]}
    }


    handleChange = (event) => {
        this.setState({chosen_application:event.target.value});
    };

    handleClose = (event) =>{
        event.preventDefault();
        let app = this.state.chosen_application;
        this.props.done(app);
    };

    render() {
        return(
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Application Choice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormLayout>
                        <Label>Application Name</Label>
                        <Select name="peripheral_type" onChange={this.handleChange}>
                            <option value="" hidden>Application Name</option>
                            {this.applications_list.map((name,i) => (
                                <option key={i} >{name}</option>
                            ))}
                        </Select>
                    </FormLayout>

                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.handleClose}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        );
    }
}


export default connect(mapStateToProps)(ApplicationChooser);
