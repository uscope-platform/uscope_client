import React, {Component}  from 'react';
import {Button, Col, Image, Row} from "react-bootstrap";

import {showModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux"

import AppCreatorPeripheralModal from "./appCreatorPeripheralModal";
import AppCreatorPeripheralsDisplay from "./AppCreatorPeripheralsDisplay";
import AppCreatorParameterDisplay from "./AppCreatorParameterDisplay";

import produce from "immer"
import AppCreatorParameterModal from "./appCreatorParameterModal";
import AppCreatorMacroModal from "./appCreatorMacroModal";
import AppCreatorChannelModal from "./appCreatorChannelModal";
import AppCreatorAppNameModal from "./AppCreatorAppNameModal";
import AppCreatorInitialRegisterModal from './appCreatorInitialRegisterModal'
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
        this.state= {app:{ bitstream: null, initial_registers_values:[], tabs:[], parameters: [], macro:[], channels:[]}, tab_parameters:[], last_channel_id:0};
    }

    handleClick = (event) =>{
        switch (event.target.id) {
            case 'addParameter':
                this.props.showModal('app_creator_parameter_modal');
                break;
            case 'addPeripheral':
                this.props.showModal('app_creator_peripheral_modal');
                break;
            case  'addMacro':
                this.props.showModal('app_creator_macro_modal');
                break;
            case 'addChannel':
                this.props.showModal('app_creator_channel_modal');
                break;
            case 'addIRV':
                this.props.showModal('app_creator_IRV_modal');
                break;
            default:
                break;
        }
    };

    handleSubmit = (event) =>{
        const nextState = produce(this.state.app, draftState => {
            let id = 1;
            // eslint-disable-next-line
            for(let channel of draftState.channels){
                channel.id = id;
                id +=1;
            }
        });
        this.setState({app: nextState});
        this.props.showModal('app_creator_app_name_modal');
    };

    handleSendApplication= (app) =>{
        let application = {[app.name]:{...this.state.app}};
        application[app.name]['bitstream'] = app.bitstream;
        this.props.server.app_proxy.createApplication(application);
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


    handleParameterDefinitionDone = (parameter) =>{
        this.setState({app:{...this.state.app, parameters:[...this.state.app.parameters, parameter]}});
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

    handleMacroDefinitionDone = (macro) =>{
        this.setState({app:{...this.state.app, macro:[...this.state.app.macro, macro]}});
    };

    handleMacroRemove = (event) => {
        let evicted = event.target.name;

        const nextState = produce(this.state.app, draftState => {
            draftState.macro = draftState.macro.filter((elem) => {
                    return elem.name !== evicted;
                }
            );
        });
        this.setState({app: nextState});
    };

    handleChannelDefinitionDone = (channel) =>{
        this.setState({app:{...this.state.app, channels:[...this.state.app.channels, channel]}});
    };

    handleChannelRemove = (event) => {
        let evicted = event.target.name;

        const nextState = produce(this.state.app, draftState => {
            draftState.channels = draftState.channels.filter((elem) => {
                return elem.name !== evicted;
            });
        });

        this.setState({app: nextState});
    };

    handleIRVDefinitionDone = (irv) =>{
        this.setState({app:{...this.state.app, initial_registers_values:[...this.state.app.initial_registers_values, irv]}});
    };

    handleIRVRemove = (event) => {
        let evicted = event.target.name;

        const nextState = produce(this.state.app, draftState => {
            draftState.initial_registers_values = draftState.initial_registers_values.filter((elem) => {
                return elem.name !== evicted;
            });
        });

        this.setState({app: nextState});
    };


    render(){
        return(
            <div>
                <AppCreatorAppNameModal done={this.handleSendApplication}/>
                <Row>
                    <AppCreatorPeripheralModal done={this.handlePeripheralDefinitionDone}/>
                    <AppCreatorParameterModal  done={this.handleParameterDefinitionDone}/>
                    <Col id={"tab_creator_add_register_col"}>
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
                    <AppCreatorMacroModal done={this.handleMacroDefinitionDone}/>
                    <AppCreatorChannelModal done={this.handleChannelDefinitionDone}/>
                    <Col  id={"tab_creator_add_register_col"}>
                        <Row>
                            <Col md={{ span: 6, offset: 4 }}><AppCreatorPeripheralsDisplay peripherals={this.state.app.macro} remove={this.handleMacroRemove} /></Col>
                        </Row>
                        <Row>
                            <Image src="assets/Icons/add_macro.svg" alt='addMacro' id="addMacro" onClick={this.handleClick} fluid/>
                        </Row>

                    </Col>
                    <Col id={"tab_creator_add_register_col"}>
                        <Row>
                            <Col md={{ span: 6, offset: 4 }}><AppCreatorPeripheralsDisplay peripherals={this.state.app.channels} remove={this.handleChannelRemove} /></Col>
                        </Row>
                        <Row>
                            <Image src="assets/Icons/add_channel.svg" id="addChannel" alt='add Channel' onClick={this.handleClick} fluid/>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <AppCreatorInitialRegisterModal done={this.handleIRVDefinitionDone}/>
                    <Col id={"tab_creator_add_register_col"}>
                        <Row>
                            <Col md={{ span: 6, offset: 5 }}><AppCreatorPeripheralsDisplay peripherals={this.state.app.initial_registers_values} remove={this.handleIRVRemove} /></Col>
                        </Row>
                        <Row>
                            <Image src="assets/Icons/add_IRV.svg" id="addIRV" alt='add initial register value' onClick={this.handleClick} fluid/>
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
