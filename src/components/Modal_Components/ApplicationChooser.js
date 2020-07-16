import React, {Component} from 'react';

import {Button, Select} from "../UI_elements"
import {Modal} from "react-bootstrap";
import {connect} from "react-redux";
import styled from "styled-components";

function mapStateToProps(state) {
    return{
        applications:state.applications
    }
}

const ComponentLayout = styled.div`
display: flex;
flex-direction: column;

`
const Centering = styled.div`
  margin-left: auto;
  margin-right: auto;  
`

const Title = styled.h1`
font-size: 2em;
`
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
                <ComponentLayout>
                    <Centering>
                        <Title>Application Choice</Title>
                            <Select name="peripheral_type" onChange={this.handleChange}>
                                <option value="" hidden>Application Name</option>
                                {this.applications_list.map((name,i) => (
                                    <option key={i} >{name}</option>
                                ))}
                            </Select>
                        <Button style={{margin:"1rem 1rem"}} onClick={this.handleClose}>Save changes</Button>
                    </Centering>
                </ComponentLayout>
            </Modal.Dialog>
        );
    }
}


export default connect(mapStateToProps)(ApplicationChooser);
