import React, {Component} from 'react';

import Button from "../UI_elements/Button"
import InputField from "../UI_elements/InputField";
import Checkbox from "../UI_elements/checkbox";
import {hideModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux";
import styled from "styled-components";


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

const ComponentStyle = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: auto;
  grid-column-gap: 0.5rem;
  grid-row-gap: 2rem;
  margin-left: auto;
  margin-right: auto;
`


const LoginFormLayout = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: auto;
  grid-column-gap: 0.5rem;
  grid-row-gap: 1rem;
  width: 20rem;
  margin-left: auto;
  margin-right: auto;  
`

const Centering = styled.div`
  margin-left: auto;
  margin-right: auto;  
`

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
            <ComponentStyle>
                <Centering>
                    <h1>Please Sign In</h1>
                </Centering>
                <LoginFormLayout>
                    <InputField name='username' compact onChange={this.handleChange} label="Username"/>
                    <InputField name='password' type='password' compact onChange={this.handleChange} label="Password"/>
                    <Checkbox name='remember_me' onChange={this.handleChange} label="Remember Me"/>
                </LoginFormLayout>
                <Centering>
                    <Button onClick={this.handleClose}>Sign In</Button>
                </Centering>
            </ComponentStyle>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
