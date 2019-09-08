import React, {Component} from 'react';

import {Tab, Tabs} from "react-bootstrap";
import TabContent from "./components/TabContent";
import {connect} from "react-redux";

import {setSetting} from "./redux/Actions/SettingsActions";

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
        setSettings: (setting) => {dispatch(setSetting(["application", setting]))}
    }
};

class App extends Component {
    constructor(props) {
        super(props);
        this.server = new serverProxy('http://172.18.0.1:4999/uscope/');
        this.state = {initializationPhase: 'start'};
        this.server.app_proxy.getApplicationsList().then((result) =>{
            this.setState({available_apps: result});
            this.setState({initializationPhase:'application_choice'})
        });
    }

    handleApplicationChosen = e =>{
        this.setState({initializationPhase:'done'});
        this.props.setSettings(e);
    };

    render() {
        if(this.state.initializationPhase==='application_choice'){
            return (
                <div className="App">
                    <ApplicationChooser applications={this.state.available_apps} done={this.handleApplicationChosen}/>
                </div>
            );
        } else if(this.state.initializationPhase==='done'){
            return (
                <div className="App">
                    <Tabs defaultActiveKey={this.props.settings.default_tab} id="uncontrolled-tab-example">
                        {this.props.tabs.map((tab) => {
                            return(
                                <Tab eventKey={tab.name} title={tab.name}> <TabContent tab={tab}/></Tab>
                            )
                        })}
                    </Tabs>
                </div>
            );
        } else{
            return(
                <h1>loading</h1>
            )
        }
    }


}

export default connect(mapStateToProps, mapDispatchToProps)(App);


