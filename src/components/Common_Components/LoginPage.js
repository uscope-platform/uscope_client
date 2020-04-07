import React, {Component} from 'react';

import {Container, Row, Col, Button, Form} from "react-bootstrap";
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
                    <Form>
                        <Form.Group>
                            <Form.Control inline name='username' placeholder="Usernamne" type="text" value={this.state.username} onChange={this.handleChange} />
                            <Form.Control inline name='password' placeholder="Password" type="password" value={this.state.password}  onChange={this.handleChange} />
                            <Form.Check inline name='remember_me' type="checkbox" label="Remember Me" value={this.state.remember_me} onChange={this.handleChange}/>
                        </Form.Group>
                    </Form>
                </Row>
                <Row>
                    <Button variant="primary" type="submit" onClick={this.handleClose}>Sign In</Button>
                </Row>
            </Container>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
