import React, {Component}  from 'react';
import Button from "../../UI_elements/Button"
import Image from "../../UI_elements/Image"

import {showModal} from "../../../redux/Actions/modalsActions";
import {connect} from "react-redux"

import AppCreatorPeripheralModal from "./appCreatorPeripheralModal";
import AppCreatorPeripheralsDisplay from "./AppCreatorPeripheralsDisplay";

import produce from "immer"
import AppCreatorParameterModal from "./appCreatorParameterModal";
import AppCreatorMacroModal from "./appCreatorMacroModal";
import AppCreatorChannelModal from "./appCreatorChannelModal";
import AppCreatorAppNameModal from "./AppCreatorAppNameModal";
import AppCreatorInitialRegisterModal from './appCreatorInitialRegisterModal'
import styled from "styled-components";
function mapStateToProps(state) {
    return{
        modals:state.modals,
        settings:state.settings,
        applications:state.applications
    }
}

const mapDispatchToProps = dispatch => {
    return{
        showModal: (modal) => {dispatch(showModal(modal))},
    }
};


const LayoutWrapper = styled.div`
    display: grid;
    margin: 1rem 1rem;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    grid-row-gap: 1rem; 
`
const SingleRowWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
`
const SplitRowWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
     grid-column-gap: 1rem;
    grid-auto-rows: auto;
`
const ElementWrapper = styled.div`
    display: grid;
    justify-items: center;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    
`

class ApplicationsCreator extends Component {
    constructor(props) {
        super(props);
        if(this.props.settings.edit_application_mode){
            this.state= {
                app:this.props.applications[this.props.settings.edit_application_name],
                tab_parameters:[],
                last_channel_id:0,
                edit_IRV:{
                    name:"",
                    address:"",
                    value:""
                },
                edit_channel:{
                    name:"",
                    min_value:null,
                    max_value:null
                },
                edit_macro:{
                    name:"",
                    trigger:""
                },
                edit_parameter:{
                    visible:false,
                    parameter_name:"",
                    trigger:"",
                    default_value:null
                },
                edit_peripheral:{
                    proxied:false,
                    accessible:false,
                    base_address:"",
                    proxy_address:""
                }
            };
        } else {
            this.state= {
                app:{
                    bitstream: null,
                    initial_registers_values:[],
                    tabs:[],
                    parameters: [],
                    macro:[],
                    channels:[]
                },
                tab_parameters:[],
                last_channel_id:0,
                edit_IRV:{
                    name:"",
                    address:"",
                    value:""
                },
                edit_channel:{
                    name:"",
                    min_value:null,
                    max_value:null

                },
                edit_macro:{
                    name:"",
                    trigger:""
                },
                edit_parameter:{
                    visible:false,
                    parameter_name:"",
                    trigger:"",
                    default_value:null
                },
                edit_peripheral:{
                    proxied:false,
                    accessible:false,
                    base_address:"",
                    proxy_address:""
                }
            };
        }
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
        this.props.settings.server.app_proxy.createApplication(application);
    };

    handlePeripheralDefinitionDone = (peripheral) =>{

        let edited = false;
        let new_peripherals = this.state.app.tabs.map((old_peripheral)=>{

            if(this.state.edit_peripheral.tab_id === old_peripheral.tab_id){
                edited = true;
                return peripheral;
            }
            else
                return old_peripheral
        });

        if(!edited){
            this.setState({app:{...this.state.app, tabs:[...this.state.app.tabs, peripheral]}});
        } else{
            this.setState({app:{...this.state.app, tabs:new_peripherals}});
        }
    };

    handlePeripheralRemove = (target_peripheral) =>{

        const nextState = produce(this.state.app, draftState => {
            draftState.tabs = draftState.tabs.filter( (elem) => {
                    return elem.name !== target_peripheral;
                }
            );
        });
        this.setState({app: nextState});
    };

    editPeripheral = (target_name) => {

        let currentPeripheral = this.state.app.tabs.filter((peripheral)=>{
            if(peripheral.name === target_name)
                return peripheral;
            else
                return null;
        });


        this.setState({edit_peripheral:{...this.state.edit_peripheral, ...currentPeripheral[0]}});
        this.props.showModal('app_creator_peripheral_modal');
    };


    handleParameterDefinitionDone = (parameter) =>{

        let edited = false;
        let new_parameters = this.state.app.parameters.map((old_parameter)=>{

            if(this.state.edit_parameter.parameter_name === old_parameter.parameter_name){
                edited = true;
                return parameter;
            }
            else
                return old_parameter
        });

        if(!edited){
            this.setState({app:{...this.state.app, parameters:[...this.state.app.parameters, parameter]}});
        } else{
            this.setState({app:{...this.state.app, parameters:new_parameters}});
        }

    };

    handleParameterRemove = (target_parameter) =>{
        const nextState = produce(this.state.app, draftState => {
            draftState.parameters = draftState.parameters.filter( (elem) => {
                    return elem.parameter_name !== target_parameter;
                }
            );
        });
        this.setState({app: nextState});
    };

    editParameter = (target_name) => {

        let currentParameter = this.state.app.parameters.filter((parameter)=>{
            if(parameter.parameter_name === target_name)
                return parameter;
            else
                return null;
        });
        this.setState({edit_parameter:{...this.state.edit_parameter, ...currentParameter[0]}});
        this.props.showModal('app_creator_parameter_modal');
    };


    handleMacroDefinitionDone = (macro) =>{
        let edited = false;
        let new_macros = this.state.app.macro.map((old_macro)=>{

            if(this.state.edit_macro.name === old_macro.name) {
                edited = true;
                return macro;
            }
            else
                return old_macro
        });

        if(!edited){
            this.setState({app:{...this.state.app, macro:[...this.state.app.macro, macro]}});
        } else{
            this.setState({app:{...this.state.app, macro:new_macros}});
        }

    };

    handleMacroRemove = (target_macro) => {

        const nextState = produce(this.state.app, draftState => {
            draftState.macro = draftState.macro.filter((elem) => {
                    return elem.name !== target_macro;
                }
            );
        });
        this.setState({app: nextState});
    };

    editMacro = (target_name) => {
        let currentMacro = this.state.app.macro.filter((macro)=>{
            if(macro.name === target_name)
                return macro;
            else
                return null;
        });
        this.setState({edit_macro:{...this.state.edit_macro, ...currentMacro[0]}});
        this.props.showModal('app_creator_macro_modal');
    };

    handleChannelDefinitionDone = (channel) =>{
        let edited = false;

        let new_channels = this.state.app.channels.map((old_channel)=>{
            if(this.state.edit_channel.name === old_channel.name){
                edited = true;
                return channel;
            }
            else
                return old_channel
        });

        if(!edited){
            this.setState({app:{...this.state.app, channels:[...this.state.app.channels, channel]}});
        } else{
            this.setState({app:{...this.state.app, channels:new_channels}});
        }

    };

    handleChannelRemove = (target_name) => {

        const nextState = produce(this.state.app, draftState => {
            draftState.channels = draftState.channels.filter((elem) => {
                return elem.name !== target_name;
            });
        });

        this.setState({app: nextState});
    };

    editChannel = (target_name) => {
        let currentChannel = this.state.app.channels.filter((channel)=>{
            if(channel.name === target_name)
                return channel;
            else
                return null;
        });
        this.setState({edit_channel:{...this.state.edit_channel, ...currentChannel[0]}});
        this.props.showModal('app_creator_channel_modal');
    };


    handleIRVDefinitionDone = (irv) =>{
        let edited = false;
        let new_irvs = this.state.app.initial_registers_values.map((old_irv)=>{
            if(this.state.edit_IRV.address === old_irv.address){
                edited = true;
                return irv;
            }
            else
                return old_irv
        });

        if(!edited){
            this.setState({app:{...this.state.app, initial_registers_values:[...this.state.app.initial_registers_values, irv]}});
        } else{
            this.setState({app:{...this.state.app, initial_registers_values:new_irvs}});
        }
    };

    handleIRVRemove = (target_address) => {
        const nextState = produce(this.state.app, draftState => {
            draftState.initial_registers_values = draftState.initial_registers_values.filter((elem) => {
                return elem.address !== target_address;
            });
        });

        this.setState({app: nextState});
    };

    editIRV = (target_address) => {
        let currentIRV = this.state.app.initial_registers_values.filter((IRV)=>{
            if(IRV.address === target_address)
                return IRV;
            else
                return null;
        });
        this.setState({edit_IRV:{...this.state.edit_IRV, ...currentIRV[0]}});
        this.props.showModal('app_creator_IRV_modal');
    };


    render(){
        return(
            <LayoutWrapper>
                <AppCreatorAppNameModal done={this.handleSendApplication}/>
                <AppCreatorPeripheralModal init_values={this.state.edit_peripheral} done={this.handlePeripheralDefinitionDone}/>
                <AppCreatorParameterModal init_values={this.state.edit_parameter} done={this.handleParameterDefinitionDone}/>
                <AppCreatorMacroModal init_values={this.state.edit_macro} done={this.handleMacroDefinitionDone}/>
                <AppCreatorChannelModal init_values={this.state.edit_channel} done={this.handleChannelDefinitionDone}/>
                <AppCreatorInitialRegisterModal init_values={this.state.edit_IRV} done={this.handleIRVDefinitionDone}/>
                <SplitRowWrapper>
                    <ElementWrapper>
                        <AppCreatorPeripheralsDisplay id_field={'name'} peripherals={this.state.app.tabs} remove={this.handlePeripheralRemove} onClick={this.editPeripheral}  />
                        <Image src="assets/Icons/add_peripheral.svg" alt='add peripheral' id="addPeripheral" onClick={this.handleClick} fluid/>
                    </ElementWrapper>

                    <ElementWrapper>
                        <AppCreatorPeripheralsDisplay id_field={'parameter_name'} peripherals={this.state.app.parameters} remove={this.handleParameterRemove} onClick={this.editParameter}/>
                        <Image src="assets/Icons/add_parameter.svg" id="addParameter" alt='add parameter' onClick={this.handleClick} fluid/>
                    </ElementWrapper>
                </SplitRowWrapper>
                <SplitRowWrapper>
                    <ElementWrapper>
                        <AppCreatorPeripheralsDisplay id_field={'name'} peripherals={this.state.app.macro} remove={this.handleMacroRemove}  onClick={this.editMacro} />
                        <Image src="assets/Icons/add_macro.svg" alt='addMacro' id="addMacro" onClick={this.handleClick} fluid/>
                    </ElementWrapper>
                    <ElementWrapper>
                        <AppCreatorPeripheralsDisplay id_field={'name'} peripherals={this.state.app.channels} remove={this.handleChannelRemove} onClick={this.editChannel} />
                        <Image src="assets/Icons/add_channel.svg" id="addChannel" alt='add Channel' onClick={this.handleClick} fluid/>
                    </ElementWrapper>
                </SplitRowWrapper>
                <SingleRowWrapper>
                    <ElementWrapper>
                        <AppCreatorPeripheralsDisplay id_field={'address'} peripherals={this.state.app.initial_registers_values} remove={this.handleIRVRemove} onClick={this.editIRV} />
                        <Image src="assets/Icons/add_IRV.svg" id="addIRV" alt='add initial register value' onClick={this.handleClick} fluid/>
                        <Button variant="success" onClick={this.handleSubmit}> Submit</Button>
                    </ElementWrapper>
                </SingleRowWrapper>
            </LayoutWrapper>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsCreator);
