import React, {Component} from 'react';
import Image from "../UI_elements/Image";

import {connect} from "react-redux";
import RegisterInputForm from "./RegisterInputForm";
import styled from "styled-components";
import {setSetting} from "../../redux/Actions/SettingsActions";
import {loadTabs} from "../../redux/Actions/TabsActions";
import {loadRegisters} from "../../redux/Actions/RegisterActions";


const LayoutWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-auto-rows: minmax(0, 10rem);
    grid-gap: 1.5rem;
    margin-top: 1rem;
    margin-right: 1rem;
    margin-left: 1rem;

`

function mapStateToProps(state) {
    return{
        peripherals:state.peripherals,
        settings:state.settings,
        registerValues:state.registerValues
    }
}

const mapDispatchToProps = dispatch => {
    return{
        setSettings: (setting) => {dispatch(setSetting(setting))}
    }
};



class RegisterTab extends Component {
    constructor(props) {
        super(props);

        this.server = this.props.server;
        }

        componentDidMount() {
            this.props.setSettings(["current_view_requires_sidebar", false]);
        }

        componentWillUnmount() {
            this.props.setSettings(["current_view_requires_sidebar", true]);
        }

    render(){
        return(
            <LayoutWrapper>
                <Image src={this.props.server.server_url + this.props.content.image_src} alt='Peripheral diagram' fluid/>
                <RegisterInputForm registers={this.props.peripherals[this.props.content.tab_id].registers} values={this.props.registerValues[this.props.content.tab_id]} server={this.props.server} content={this.props.registerValues[this.props.content.tab_id]}/>
            </LayoutWrapper>
        );
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(RegisterTab,);
