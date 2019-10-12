import React, {Component}  from 'react';
import {Button, Col, Image, Row} from "react-bootstrap";

import {showModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux"

import AppCreatorPeripheralModal from "./appCreatorPeripheralModal";
import AppCreatorPeripheralsDisplay from "./AppCreatorPeripheralsDisplay";
import AppCreatorParameterDisplay from "./AppCreatorParameterDisplay";

import produce from "immer"
import AppCreatorParameterModal from "./appCreatorParameterModal";

function mapStateToProps(state) {
    return{
        modals:state.modals
    }
}

const mapDispatchToProps = dispatch => {
    return{
        showModal: (modal) => {dispatch(showModal(modal))},
    }
};

class ApplicationsCreator extends Component {
    constructor(props) {
        super(props);
        this.state= {app:{tabs:[], parameters: []}, tab_parameters:[]};
    }

    handleClick = (event) =>{
        switch (event.target.id) {
            case 'addParameter':
                this.props.showModal('app_creator_parameter_modal');
                break;
            case 'addPeripheral':
                this.props.showModal('app_creator_peripheral_modal');
                break;
            default:
                break;
        }
    };

    handleSubmit = (event) =>{

    };

    handleSendApplication= (app) =>{

    };

    handlePeripheralDefinitionDone = (peripheral) =>{
        this.setState({app:{...this.state.app, tabs:[...this.state.app.tabs, peripheral]}});
    };

    handlePeripheralRemove = (event) =>{
        let evicted = event.target.name;

        const nextState = produce(this.state.app, draftState => {
            draftState.tabs = draftState.tabs.filter( (elem) => {
                    return elem.name !== evicted;
                }
            );
        });
        this.setState({app: nextState});
    };


    handleParameterDefinitionDone = (peripheral) =>{
        this.setState({app:{...this.state.app, parameters:[...this.state.app.parameters, peripheral]}});
    };

    handleParameterRemove = (event) =>{
        let evicted = event.target.name;

        const nextState = produce(this.state.app, draftState => {
            draftState.parameters = draftState.parameters.filter( (elem) => {
                    return elem.parameter_name !== evicted;
                }
            );
        });
        this.setState({app: nextState});
    };

    render(){
        return(
            <div>
                <Row>
                    <AppCreatorPeripheralModal server={this.props.server} done={this.handlePeripheralDefinitionDone}/>
                    <AppCreatorParameterModal server={this.props.server} done={this.handleParameterDefinitionDone}/>
                    <Col md={6} id={"tab_creator_add_register_col"}>
                        <Row>
                            <Col md={{ span: 6, offset: 4 }}><AppCreatorPeripheralsDisplay peripherals={this.state.app.tabs} remove={this.handlePeripheralRemove} /></Col>
                        </Row>
                        <Row>
                            <Image src="assets/Icons/add_peripheral.svg" alt='add peripheral' id="addPeripheral" onClick={this.handleClick} fluid/>
                        </Row>

                    </Col>
                    <Col id={"tab_creator_add_register_col"}>
                        <Row>
                            <Col md={{ span: 6, offset: 4 }}><AppCreatorParameterDisplay parameters={this.state.app.parameters} remove={this.handleParameterRemove} /></Col>
                        </Row>
                        <Row>
                            <Image src="assets/Icons/add_parameter.svg" id="addParameter" alt='add parameter' onClick={this.handleClick} fluid/>
                        </Row>

                    </Col>
                </Row>
                <Row>
                    <AppCreatorPeripheralModal server={this.props.server} done={this.handlePeripheralDefinitionDone}/>
                    <AppCreatorParameterModal server={this.props.server} done={this.handleParameterDefinitionDone}/>
                    <Col md={6} id={"tab_creator_add_register_col"}>
                        <Row>
                            <Col md={{ span: 6, offset: 4 }}><AppCreatorPeripheralsDisplay peripherals={this.state.app.tabs} remove={this.handlePeripheralRemove} /></Col>
                        </Row>
                        <Row>
                            <Image src="assets/Icons/add_macro.svg" alt='add peripheral' id="addPeripheral" onClick={this.handleClick} fluid/>
                        </Row>

                    </Col>
                    <Col id={"tab_creator_add_register_col"}>
                        <Row>
                            <Col md={{ span: 6, offset: 4 }}><AppCreatorParameterDisplay parameters={this.state.app.parameters} remove={this.handleParameterRemove} /></Col>
                        </Row>
                        <Row>
                            <Image src="assets/Icons/add_channel.svg" id="addParameter" alt='add parameter' onClick={this.handleClick} fluid/>
                        </Row>
                        <Row>
                            <Col md={{ span: 3, offset: 9 }}>
                                <Button variant="success" onClick={this.handleSubmit}>
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsCreator);
