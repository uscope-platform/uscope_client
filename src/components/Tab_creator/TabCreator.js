import React, {Component}  from 'react';
import {Col, Image, Row} from "react-bootstrap";

import TabCreatorRegisterModal from "../Modal_Components/tabCreatorRegisterModal"
import TabCreatorImageChooser from "../Modal_Components/tabCreatorImageChooser";
import {showModal} from "../../redux/Actions/modalsActions";
import {connect} from "react-redux"


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
        this.state= {tab_image:"assets/Icons/add_peripheral_img.svg"};
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
        let reader = new FileReader();
        reader.onload = () => {
            this.setState({tab_image:reader.result});
        };
        reader.readAsDataURL(file);
    };

    handleRegisterCreationDone = () => {

    };

    render(){
        return(
            <div>
                <TabCreatorImageChooser server={this.props.server} done={this.handleImageChoiceDone}/>
                <TabCreatorRegisterModal server={this.props.server} done={this.handleRegisterCreationDone}/>
                <Row>
                    <Col md={5} id={"tab_creator_add_image_col"}>
                        <Image src={this.state.tab_image} alt='add tab image' id="addImage" onClick={this.handleClick} fluid/>
                        <div id={"tab_creator_add_image_caption"}>
                            <h5>Add diagram here</h5>
                        </div>
                    </Col>
                    <Col>
                        <div id={"tab_creator_add_register_col"}>
                            <Image src="assets/Icons/add_register.svg" id="addRegister" alt='add register' onClick={this.handleClick}fluid/>
                        </div>
                    </Col>
                </Row>
            </div>

        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabCreator);
