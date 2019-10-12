import React, {Component}  from 'react';
import {Button, Col, Image, Row} from "react-bootstrap";

import {showModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux"

import RegisterInputForm from "../../register_tab_components/RegisterInputForm";
import AppCreatorPeripheralModal from "./appCreatorPeripheralModal";
import AppCreatorPeripheralsDisplay from "./AppCreatorPeripheralsDisplay";

import produce from "immer"

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
        this.state= {app:{tabs:[]}, tab_parameters:[]};
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
        let peripheral_name = event.target.name;

        const nextState = produce(this.state.app, draftState => {
            draftState.tabs = draftState.tabs.filter( (elem) => {
                    return elem.name !== peripheral_name;
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
                    <Col md={6} id={"tab_creator_add_register_col"}>
                        <Row>
                            <Col md={{ span: 6, offset: 4 }}><AppCreatorPeripheralsDisplay peripherals={this.state.app.tabs} remove={this.handlePeripheralRemove} /></Col>

                        </Row>
                        <Row>
                            <Image src="assets/Icons/add_register.svg" alt='add peripheral' id="addPeripheral" onClick={this.handleClick} fluid/>
                        </Row>

                    </Col>
                    <Col id={"tab_creator_add_register_col"}>
                        <RegisterInputForm registers={this.state.tab_parameters} preview_only={true} handle_remove={this.handleRemoveRegister}/>
                        <Row>
                            <Image src="assets/Icons/add_register.svg" id="addParameter" alt='add parameter' onClick={this.handleClick}
                                   fluid/>
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
