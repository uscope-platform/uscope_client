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
        this.state= {app:{tabs:[], parameters: [], macro:[], channels:[]}, tab_parameters:[], last_channel_id:0};
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
        channel['id'] = this.state.last_channel_id+1;
        this.setState({last_channel_id:  this.state.last_channel_id+1});
        this.setState({app:{...this.state.app, channels:[...this.state.app.channels, channel]}});
    };

    //TODO: Channel remove does not work anymore
    handleChannelRemove = (event) => {
        let evicted = event.target.name;

        const nextState = produce(this.state.app, draftState => {

            draftState.channels = draftState.channels.filter((elem) => {
                    return elem.name !== evicted;
                }
            );
            let previous_id = 0;
            for(let elem of draftState.channels){
                if(elem.id!==previous_id+1){
                    debugger;
                }
            }
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
                    <AppCreatorMacroModal server={this.props.server} done={this.handleMacroDefinitionDone}/>
                    <AppCreatorChannelModal server={this.props.server} done={this.handleChannelDefinitionDone}/>
                    <Col md={6} id={"tab_creator_add_register_col"}>
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
