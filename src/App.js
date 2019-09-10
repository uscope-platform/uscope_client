import React, {Component} from 'react';

import {Tab, Tabs, Container} from "react-bootstrap";
import TabContent from "./components/TabContent";
import {connect} from "react-redux";

import {setSetting} from "./redux/Actions/SettingsActions";
import {loadTabs} from "./redux/Actions/TabsActions";
import {loadRegisters} from "./redux/Actions/RegisterActions";

import './App.css';
import serverProxy from "./redux/ServerProxy";
import ApplicationChooser from "./components/Modal_Components/ApplicationChooser";


function mapStateToProps(state) {
    return{
        tabs:state.tabs,
        settings:state.settings
    }
}

const mapDispatchToProps = dispatch => {
    return{
        setSettings: (setting) => {dispatch(setSetting(["application", setting]))},
        loadTabs: (tab) => {dispatch(loadTabs(tab))},
        loadRegisters: (peripheral, registers) => {dispatch(loadRegisters(peripheral,registers))}
    }
};

class App extends Component {

    constructor(props) {
        super(props);
        this.server = new serverProxy('http://172.18.0.1:4999/uscope/');
        this.state = {initializationPhase: 'start'};
        this.server.app_proxy.getApplicationsList().then((result) =>{
            this.setState({available_apps: result});
            this.setState({initializationPhase:'application_choice'});
            return result
        });
        this.server.app_proxy.getApplicationParameters();
        this.server.plot_proxy.getChannelsInfo();
    }

    handleApplicationChosen = e =>{
        this.server.app_proxy.getApplication(e).then((result) =>{
            this.props.setSettings(e);
            this.initializeRegisterStore(result.tabs);
            this.props.loadTabs(result.tabs);
        });
    };

    initializeRegisterStore = (tabs) =>{

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
            this.setState({initializationPhase:'done'});
            }
        );
    };

    render() {
        switch (this.state.initializationPhase) {
            case "application_choice":
                return (
                    <div className="App">
                        <ApplicationChooser applications={this.state.available_apps} done={this.handleApplicationChosen}/>
                    </div>
                );
            case "done":
                return (
                    <div className="App">
                        <Tabs defaultActiveKey={this.props.settings.default_tab} id="uncontrolled-tab-example">
                            {this.props.tabs.map((tab, i) => {
                                if(tab.user_accessible){
                                    return(
                                        <Tab eventKey={tab.name} key={i} title={tab.name}> <TabContent server={this.server} tab={tab}/></Tab>
                                    )
                                } else {
                                    return null;
                                }
                            })}
                        </Tabs>
                    </div>
                );
            default:
                return(
                    <Container>
                    </Container>
                )
        }

    }


}

export default connect(mapStateToProps, mapDispatchToProps)(App);


