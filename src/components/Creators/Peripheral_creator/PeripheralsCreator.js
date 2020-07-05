import React, {Component}  from 'react';
import Button from "../../UI_elements/Button"
import { Col, Image, Row} from "react-bootstrap";

import TabCreatorRegisterModal from "./peripheralCreatorRegisterModal"
import TabCreatorImageChooser from "./peripheralCreatorImageChooser";
import TabCreatorPeripheralParametersModal from "./peripheralCreatorPeripheralParametersModal"

import {showModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux"

import RegisterInputForm from "../../register_tab_components/RegisterInputForm";


function mapStateToProps(state) {
    return{
        modals:state.modals,
        settings:state.settings,
        peripherals:state.peripherals,
    }
}

const mapDispatchToProps = dispatch => {
    return{
        showModal: (modal) => {dispatch(showModal(modal))},
    }
};

class PeripheralsCreator extends Component {
    constructor(props) {
        super(props);
        if(props.settings.edit_peripheral_mode){
            this.state= {
                tab_image:props.server.server_url + props.peripherals[props.settings.edit_peripheral_name].image,
                tab_image_raw:null,
                tab_registers:props.peripherals[props.settings.edit_peripheral_name].registers,
                edit_register:{
                    ID:""
                }
            };
        } else {
            this.state = {
                tab_image:"assets/Icons/add_peripheral_img.svg",
                tab_image_raw:null,
                tab_registers:[],
                edit_register:{
                    ID:""
                }
            };
        }
    }



    handleClick = (event) =>{
        switch (event.target.id) {
            case "addImage":
                this.props.showModal('peripheral_creator_image_choice');
                break;
            case "addRegister":
                this.setState({edit_register:undefined});
                this.props.showModal('peripheral_creator_register_modal');
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
        let edited = false;
        let new_registers = this.state.tab_registers.map((old_register)=>{

            if(this.state.edit_register.ID === old_register.ID){
                edited = true;
                return register;
            }
            else
                return old_register
        });

        if(!edited){
            this.setState({tab_registers:[...this.state.tab_registers, register]});
        } else{
            this.setState({tab_registers:new_registers});
        }

    };

    handleRemoveRegister = (name) => {
        let newRegistersValue = this.state.tab_registers.filter( (elem) => {
                return elem.register_name !== name;
            }
        );
        this.setState({...this.state, tab_registers: newRegistersValue});
    };

    handleSubmit = (event) =>{
        if(this.state.tab_image_raw || this.state.tab_image){
            this.props.showModal("peripheral_creator_app_param_modal");
        } else {
            alert('A Peripheral diagram must be added');
        }
    };

    handleSendPeripheral= (periph) =>{
        let peripheral = {
            [periph.name]: {
                peripheral_name: periph.name,
                version: periph.version,
                registers: this.state.tab_registers
            }
        };

        if(this.props.settings.edit_peripheral_mode){
            debugger;
            this.props.server.creator_proxy.removePeripheral(this.props.settings.edit_peripheral_name);
        }

        this.props.server.creator_proxy.createPeripheral(peripheral, this.state.tab_image_raw);
    };

    handleEditRegister = (registerID) =>{
        let initial_values = this.state.tab_registers.filter((register)=>{
            return register.ID === registerID;
        });
        this.setState({edit_register:initial_values[0]});
        this.props.showModal('peripheral_creator_register_modal');
    };

    render(){
        return(
            <div>
                <TabCreatorImageChooser server={this.props.server} done={this.handleImageChoiceDone}/>
                <TabCreatorRegisterModal initial_values={this.state.edit_register} server={this.props.server} done={this.handleRegisterCreationDone}/>
                <TabCreatorPeripheralParametersModal done={this.handleSendPeripheral}/>
                <Row>
                    <Col md={5} id={"tab_creator_add_image_col"}>
                        <Image src={this.state.tab_image} alt='add tab image' id="addImage" onClick={this.handleClick} fluid/>
                    </Col>
                    <Col id={"tab_creator_add_register_col"}>
                        <RegisterInputForm registers={this.state.tab_registers} preview_only={true} handle_edit={this.handleEditRegister} handle_remove={this.handleRemoveRegister}/>
                        <Row>
                            <Image src="assets/Icons/add_register.svg" id="addRegister" alt='add register' onClick={this.handleClick} fluid/>
                        </Row>
                        <Row>
                            <Col md={{ span: 3, offset: 9 }}>
                                <Button variant="success" onClick={this.handleSubmit}>Submit</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PeripheralsCreator);
