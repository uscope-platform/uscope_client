import React, {Component}  from 'react';
import {Button, Col, Image, Row} from "react-bootstrap";

import {showModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux"

import RegisterInputForm from "../register_tab_components/RegisterInputForm";


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
        this.state= {tab_image:"assets/Icons/add_peripheral_img.svg",tab_image_raw:null, tab_registers:[]};
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
        if(this.state.tab_image_raw){
            this.props.showModal("tab_creator_app_param_modal");
        }
    };

    handleSendApplication= (periph) =>{

    };

    render(){
        return(
            <div>
                <Row>
                    <Col md={6} id={"tab_creator_add_register_col"}>
                        <Image src="assets/Icons/add_register.svg" alt='add peripheral' id="addPeripheral" onClick={this.handleClick} fluid/>
                    </Col>
                    <Col id={"tab_creator_add_register_col"}>
                        <RegisterInputForm registers={this.state.tab_registers} preview_only={true} handle_remove={this.handleRemoveRegister}/>
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
