import React, {Component}  from 'react';
import {Button, Col, Image, Row} from "react-bootstrap";

import TabCreatorRegisterModal from "../Modal_Components/tabCreatorRegisterModal"
import TabCreatorImageChooser from "../Modal_Components/tabCreatorImageChooser";
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

class TabCreator extends Component {
    constructor(props) {
        super(props);
        this.state= {tab_image:"assets/Icons/add_peripheral_img.svg", tab_registers:[]};
    }



    handleClick = (event) =>{
        switch (event.target.id) {
            case "addImage":
                this.props.showModal('tab_creator_image_choice');
                break;
            case "addRegister":
                this.props.showModal('tab_creator_register_modal');
                break;
            default:
                break;
        }
    };

    handleImageChoiceDone = (file) => {
        this.setState({tab_image_raw:file});
        let reader = new FileReader();
        reader.onload = () => {
            this.setState({tab_image:reader.result});
        };
        reader.readAsDataURL(file);
    };

    handleRegisterCreationDone = (register) => {
        this.setState({tab_registers:[...this.state.tab_registers, register]});
    };

    handleRemoveRegister = (name) => {
        let newRegistersValue = this.state.tab_registers.filter( (elem) => {
                debugger;
                return elem.register_name !== name;
            }
        );
        this.setState({...this.state, tab_registers: newRegistersValue});
    };

    handleSubmit = (event) =>{
        this.props.server.creator_proxy.createPeripheral(this.state.tab_registers, this.state.tab_image_raw);
    };

    render(){
        return(
            <div>
                <TabCreatorImageChooser server={this.props.server} done={this.handleImageChoiceDone}/>
                <TabCreatorRegisterModal server={this.props.server} done={this.handleRegisterCreationDone}/>
                <Row>
                    <Col md={5} id={"tab_creator_add_image_col"}>
                        <Image src={this.state.tab_image} alt='add tab image' id="addImage" onClick={this.handleClick} fluid/>
                    </Col>
                    <Col id={"tab_creator_add_register_col"}>
                        <RegisterInputForm registers={this.state.tab_registers} preview_only={true} handle_remove={this.handleRemoveRegister}/>
                        <Row>
                            <Image src="assets/Icons/add_register.svg" id="addRegister" alt='add register' onClick={this.handleClick}fluid/>
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

export default connect(mapStateToProps, mapDispatchToProps)(TabCreator);
