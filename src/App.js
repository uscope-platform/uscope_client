

//       REACT AND BOOTSTRAP IMPORTS
import React, {Component} from 'react';
import {Tab, Tabs, Container} from "react-bootstrap";

//       REDUX IMPORTS
import {connect} from "react-redux";
import {setSetting} from "./redux/Actions/SettingsActions";
import {loadTabs} from "./redux/Actions/TabsActions";
import {loadRegisters} from "./redux/Actions/RegisterActions";

//      APP RELATED IMPORTS
import serverProxy from "./ServerProxy";
import TabContent from "./components/TabContent";
import ApplicationChooser from "./components/Modal_Components/ApplicationChooser";
import './App.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

function mapStateToProps(state) {
    return{
        tabs:state.tabs,
        plot:state.plot,
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


const states = Object.freeze({
    START:   Symbol("start"),
    APP_CHOICE:  Symbol("app_choice"),
    RESOURCE_LOADING: Symbol("resource_loading"),
    NORMAL: Symbol("normal"),
});



class App extends Component {

    constructor(props) {
        super(props);
        this.server = new serverProxy('http://155.185.48.185:4999/uscope/');
        this.state = {initializationPhase: states.START};
        this.server.app_proxy.getApplicationsList().then((result) =>{
            this.setState({available_apps: result});
            this.setState({initializationPhase:states.APP_CHOICE});
            return result
        });

    }

    handleApplicationChosen = e =>{
        this.server.app_proxy.getApplication(e).then((result) =>{
            this.props.setSettings(e);
            this.props.loadTabs(result.tabs);
            this.initializeRegisterStore(result.tabs);

        });
    };


     loadResources = () => {
        this.server.app_proxy.getApplicationParameters();
        this.server.plot_proxy.getChannelsInfo();
        this.setState({initializationPhase:states.NORMAL});
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
                        <ApplicationChooser applications={this.state.available_apps} done={this.handleApplicationChosen}/>
                    </div>
                );
            case states.NORMAL:

                if(!this.props.plot.loading_done){
                    return(
                        <></>
                    )
                } else {
                    let ui_tabs = this.props.tabs;
                    ui_tabs.push({
                        name: "Tab creator",
                        tab_id: "tab_creator",
                        type: "tab_creator",
                        user_accessible: true
                    });
                    ui_tabs.push({
                        name: "Script manager",
                        tab_id: "script_manager",
                        type: "script_manager",
                        user_accessible: true
                    });
                    return (
                        <div className="App">
                            <Tabs defaultActiveKey={this.props.settings.default_tab} id="uncontrolled-tab-example">
                                {this.props.tabs.map((tab, i) => {
                                    if(tab.user_accessible){
                                        return(
                                            <Tab eventKey={tab.name} key={i} title={tab.name}> <TabContent className="main_content_tab" server={this.server} tab={tab}/></Tab>
                                        )
                                    } else {
                                        return null;
                                    }
                                })}
                            </Tabs>
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


