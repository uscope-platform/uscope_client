import React, {Component} from 'react';

import Button from "../UI_elements/Button"
import InputField from "../UI_elements/InputField";
import Checkbox from "../UI_elements/checkbox";
import {Container, Row, Col} from "react-bootstrap";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";


function mapStateToProps(state) {
    return{
        modals:state.modals
    }
}

const mapDispatchToProps = dispatch => {
    return{
        hideModal: () => {dispatch(hideModal('login_modal'))},
    }
};


class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {username:'', password:'', remember_me:false};
    }

    handleChange = (event) => {
        if(event.target.name==='remember_me'){
            this.setState({[event.target.name]:event.target.checked});
        } else {
            this.setState({[event.target.name]:event.target.value});
        }

    };

    handleClose = () =>{
        let login_credentials = {"user":this.state.username, "password":this.state.password, "remember_me": this.state.remember_me, 'login_type':'user'};
        this.props.done(login_credentials);
        this.props.hideModal();
    };

    render() {
        return(
            <Container>
                <Row>
                    <Col><h1>Please Sign In</h1></Col>
                </Row>
                <Row>
                    <InputField name='username' compact onChange={this.handleChange} label="Username"/>
                    <InputField name='password' type='password' compact onChange={this.handleChange} label="Password"/>
                    <Checkbox name='remember_me' onChange={this.handleChange} label="Remember Me"/>
                </Row>
                <Row>
                    <Button onClick={this.handleClose}>Sign In</Button>
                </Row>
            </Container>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
