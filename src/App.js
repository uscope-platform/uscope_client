

//       REACT AND BOOTSTRAP IMPORTS
import React, {Component} from 'react';
import {Tab, Container} from "react-bootstrap";
import {Route, Redirect} from 'react-router-dom'

//       REDUX IMPORTS
import {connect} from "react-redux";
import {setSetting} from "./redux/Actions/SettingsActions";
import {loadTabs} from "./redux/Actions/TabsActions";
import {loadRegisters} from "./redux/Actions/RegisterActions";

//      APP RELATED IMPORTS
import serverProxy from "./ServerProxy";
import TabContent from "./components/TabContent";
import Navbar from "./components/Navbar";
import ApplicationChooser from "./components/Modal_Components/ApplicationChooser";

import * as sjcl from 'sjcl';
//////  STYLE IMPORTS
import './App.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import PeripheralsCreator from "./components/Creators/PeripheralsCreator";

function mapStateToProps(state) {
    return{
        tabs:state.tabs,
        plot:state.plot,
        settings:state.settings,
        peripherals:state.peripherals,
        applications:state.applications
    }
}

const mapDispatchToProps = dispatch => {
    return{
        setSettings: (setting) => {dispatch(setSetting(["application", setting]))},
        loadTabs: (tab) => {dispatch(loadTabs(tab))},
        loadRegisters: (peripheral, registers) => {dispatch(loadRegisters(peripheral,registers))}
    }
};


const states = Object.freeze({
    START:   Symbol("start"),
    APP_CHOICE:  Symbol("app_choice"),
    RESOURCE_LOADING: Symbol("resource_loading"),
    NORMAL: Symbol("normal"),
});



class App extends Component {

    constructor(props) {
        super(props);
        this.server = new serverProxy('http://172.18.0.1:4999/uscope/'); //http://155.185.48.185:4999/uscope/
        this.server.app_proxy.loadAllApplications();
        this.state = {initializationPhase: states.APP_CHOICE};

        if(this.props.peripherals ===undefined){
            this.server.periph_proxy.loadAllPeripherals();
        } else{
            this.server.periph_proxy.get_peripherals_hash().then((res)=>{
                let periph_string = JSON.stringify(this.props.peripherals);
                let raw_hash = sjcl.hash.sha256.hash(periph_string);
                let digest = sjcl.codec.hex.fromBits(raw_hash);
                if(digest!==res){
                    this.server.periph_proxy.loadAllPeripherals();
                }
            });
        }

    }

    handleApplicationChosen = e =>{
        this.server.app_proxy.setApplication(e);
        let app = this.props.applications[e];
        this.props.setSettings(e);
        let tabs = Object.values(app.tabs);
        this.props.loadTabs(tabs);
        this.initializeRegisterStore(tabs);

    };


     loadResources = () => {
         this.server.app_proxy.getApplicationParameters();
         this.server.plot_proxy.getChannelsInfo();
         this.props.loadTabs([{
             name: "Script manager",
             tab_id: "script_manager",
             type: "script_manager",
             user_accessible: true
         }]);
         this.props.loadTabs([{
             name: "Peripherals manager",
             tab_id: "peripherals_manager",
             type: "peripherals_manager",
             user_accessible: true
         }]);
         this.props.loadTabs([{
             name: "Applications manager",
             tab_id: "applications_manager",
             type: "applications_manager",
             user_accessible: true
         }]);
        this.setState({initializationPhase:states.NORMAL});
    };



    initializeRegisterStore = (tabs) =>{
        this.setState({initializationPhase:states.RESOURCE_LOADING});

        Promise.all(tabs.map((tab) =>{
            if(tab.user_accessible && tab.type==="Registers"){
                return this.server.periph_proxy.getPeripheralRegisters(tab.tab_id);
            }
            return 'Not Needed';
        })).then((result) =>{
                result.map((item) => {
                    if(item!=='Not Needed'){
                        this.props.loadRegisters(item.peripheral_name, item.registers);
                    }
                    return null
                });
                this.setState({initializationPhase:states.RESOURCE_LOADING});
                this.loadResources();
            }
        );

    };

    render() {
        switch (this.state.initializationPhase) {
            case states.APP_CHOICE:
                return (
                    <div className="App">
                        <ApplicationChooser done={this.handleApplicationChosen}/>
                    </div>
                );
            case states.NORMAL:

                if(!this.props.plot.loading_done){
                    return(
                        <></>
                    )
                } else {
                    return (
                        <div className="App">
                            <Tab.Container defaultActiveKey={this.props.settings.default_tab}>
                                <Navbar tabs={this.props.tabs}/>
                                <Tab.Content>
                                    {this.props.tabs.map((tab, i) => {
                                        if(tab.user_accessible){
                                            return(
                                                <Route
                                                    path={'/'+tab.name}
                                                    exact
                                                    render={(props) => <TabContent className="main_content_tab" server={this.server} tab={tab}/>}
                                                />

                                            )
                                        } else {
                                            return null;
                                        }
                                    })}
                                </Tab.Content>

                            </Tab.Container>
                            <Route
                                path={'/peripheral_creator'}
                                exact
                                render={(props) => <PeripheralsCreator server={this.server}/>}
                            />
                            <Redirect exact from="/" to="plot" />
                        </div>
                    );
                }
            default:
                return(
                    <Container>
                    </Container>
                )
        }

    }


}

export default connect(mapStateToProps, mapDispatchToProps)(App);


