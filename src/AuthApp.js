

//       REACT AND BOOTSTRAP IMPORTS
import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom'

//       REDUX IMPORTS
import {connect} from "react-redux";
import {setSetting} from "./redux/Actions/SettingsActions";
import {loadTabs} from "./redux/Actions/TabsActions";
import {loadRegisters} from "./redux/Actions/RegisterActions";

//      APP RELATED IMPORTS
import TabContent from "./components/TabContent";
import Navbar from "./components/Navbar";

import ApplicationChooser from "./components/Modal_Components/ApplicationChooser";
import PeripheralsCreator from "./components/Creators/Peripheral_creator/PeripheralsCreator";
import ApplicationsCreator from "./components/Creators/Application_creator/ApplicationsCreator";

//////  STYLE IMPORTS
import './App.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import ScriptsCreator from "./components/Creators/Script_creator/ScriptsCreator";
import ApplicationLayout from "./components/UI_elements/ApplicationLayout";
import Sidebar from "./components/Sidebar";



function mapStateToProps(state) {
    return{
        tabs:state.tabs,
        plot:state.plot,
        modals:state.modals,
        scripts:state.scripts_store,
        settings:state.settings,
        peripherals:state.peripherals,
        applications:state.applications
    }
}

const mapDispatchToProps = dispatch => {
    return{
        setSettings: (setting) => {dispatch(setSetting(["application", setting]))},
        loadTabs: (tab) => {dispatch(loadTabs(tab))},
        loadRegisters: (peripheral, registers) => {dispatch(loadRegisters(peripheral,registers))},
    }
};


const states = Object.freeze({
    START:   Symbol("start"),
    APP_CHOICE:  Symbol("app_choice"),
    RESOURCE_LOADING: Symbol("resource_loading"),
    NORMAL: Symbol("normal"),
});



class AuthApp extends Component {

    constructor(props) {
        super(props);
        this.server = this.props.server;
        this.state = {initializationPhase: states.APP_CHOICE, logged:false};
        let app_digest = localStorage.getItem('Applications-hash');
        if(this.props.applications === undefined || app_digest === null){
            this.server.app_proxy.loadAllApplications();
            this.server.app_proxy.get_applications_hash().then((res)=>{
                localStorage.setItem('Applications-hash', res);
            });
        } else{
            this.server.app_proxy.get_applications_hash().then((res)=>{
                if(app_digest!==res){
                    this.server.app_proxy.loadAllApplications();
                    localStorage.setItem('Applications-hash', res);
                }
            });
        }

        let periph_digest = localStorage.getItem('Peripherals-hash');
        if(this.props.peripherals ===undefined || periph_digest === null){
            this.server.periph_proxy.loadAllPeripherals();
            this.server.periph_proxy.get_peripherals_hash().then((res)=>{
                localStorage.setItem('Peripherals-hash', res);
            });
        } else{
            this.server.periph_proxy.get_peripherals_hash().then((res)=>{
                if(periph_digest!==res){
                    this.server.periph_proxy.loadAllPeripherals();
                    localStorage.setItem('Peripherals-hash', res);
                }
            });
        }

        let script_digest = localStorage.getItem('Script-hash');
        if(this.props.scripts === undefined || script_digest === null){
            this.server.script_proxy.download_all_scripts();
            this.server.script_proxy.get_hash().then((res)=>{
                localStorage.setItem('Script-hash', res);
            });
        } else{
            this.server.script_proxy.get_hash().then((res)=>{
                if(app_digest!==res){
                    this.server.script_proxy.download_all_scripts();
                    localStorage.setItem('Script-hash', res);
                }
            });
        }


    }

    handleApplicationChosen = e =>{
        this.server.app_proxy.setApplication(e).then(()=>{
            let app = this.props.applications[e];
            this.props.setSettings(e);
            let tabs = Object.values(app.tabs);
            this.props.loadTabs(tabs);
            this.initializeRegisterStore(tabs);
        });
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
                            <ApplicationLayout sidebarNeeded={this.props.settings.current_view_requires_sidebar}>
                                <Navbar tabs={this.props.tabs}/>
                                {this.props.tabs.map((tab, i) => {
                                    if(tab.user_accessible){
                                        return(
                                            <Route
                                                key={tab.name}
                                                path={'/'+tab.name}
                                                exact
                                                render={(props) => <TabContent className="main_content_tab" server={this.server} tab={tab}/>}
                                            />

                                        )
                                    } else {
                                        return null;
                                    }
                                })}
                                <Sidebar/>
                            </ApplicationLayout>
                            <Route
                                path={'/script_creator'}
                                exact
                                render={(props) => <ScriptsCreator server={this.server}/>}
                            />
                            <Route
                                path={'/peripheral_creator'}
                                exact
                                render={(props) => <PeripheralsCreator server={this.server}/>}
                            />
                            <Route
                                path={'/application_creator'}
                                exact
                                render={(props) => <ApplicationsCreator server={this.server}/>}
                            />
                            <Redirect exact from="/" to="plot" />
                        </div>
                    );
                }
            default:
                return(
                    <>
                    </>
                )
        }

    }


}

export default connect(mapStateToProps, mapDispatchToProps)(AuthApp);


