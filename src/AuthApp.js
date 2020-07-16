//       REACT AND BOOTSTRAP IMPORTS
import React, {useEffect, useState} from 'react';
import {Redirect, Route} from 'react-router-dom'
//       REDUX IMPORTS
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "./redux/Actions/SettingsActions";
import {loadTabs} from "./redux/Actions/TabsActions";
import {loadRegisters} from "./redux/Actions/RegisterActions";
//      APP RELATED IMPORTS
import TabContent from "./components/TabContent";
import Navbar from "./components/Navbar";

import ApplicationChooser from "./components/Modal_Components/ApplicationChooser";
//////  STYLE IMPORTS
import './App.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import ScriptsCreator from "./components/Creators/Script_creator/ScriptsCreator";
import {ApplicationLayout} from "./components/UI_elements";
import Sidebar from "./components/Sidebar/Sidebar";


const states = Object.freeze({
    START:   Symbol("start"),
    APP_CHOICE:  Symbol("app_choice"),
    RESOURCE_LOADING: Symbol("resource_loading"),
    NORMAL: Symbol("normal"),
});


let AuthApp = (props) =>{

    const tabs = useSelector(state => state.tabs);
    const plot = useSelector(state => state.plot);
    const scripts = useSelector(state => state.scripts_store);
    const settings = useSelector(state => state.settings);
    const peripherals = useSelector(state => state.peripherals);
    const applications = useSelector(state => state.applications);

    const dispatch = useDispatch();

    const [init_phase, set_init_phase] = useState(states.APP_CHOICE);

    useEffect(()=>{
        let app_digest = localStorage.getItem('Applications-hash');
        if(applications === undefined || app_digest === null){
            settings.server.app_proxy.loadAllApplications();
            settings.server.app_proxy.get_applications_hash().then((res)=>{
                localStorage.setItem('Applications-hash', res);
            });
        } else{
            settings.server.app_proxy.get_applications_hash().then((res)=>{
                if(app_digest!==res){
                    settings.server.app_proxy.loadAllApplications();
                    localStorage.setItem('Applications-hash', res);
                }
            });
        }

        let periph_digest = localStorage.getItem('Peripherals-hash');
        if(peripherals ===undefined || periph_digest === null){
            settings.server.periph_proxy.loadAllPeripherals();
            settings.server.periph_proxy.get_peripherals_hash().then((res)=>{
                localStorage.setItem('Peripherals-hash', res);
            });
        } else{
            settings.server.periph_proxy.get_peripherals_hash().then((res)=>{
                if(periph_digest!==res){
                    settings.server.periph_proxy.loadAllPeripherals();
                    localStorage.setItem('Peripherals-hash', res);
                }
            });
        }

        let script_digest = localStorage.getItem('Script-hash');
        if(scripts === undefined || script_digest === null){
            settings.server.script_proxy.download_all_scripts();
            settings.server.script_proxy.get_hash().then((res)=>{
                localStorage.setItem('Script-hash', res);
            });
        } else{
            settings.server.script_proxy.get_hash().then((res)=>{
                if(app_digest!==res){
                    settings.server.script_proxy.download_all_scripts();
                    localStorage.setItem('Script-hash', res);
                }
            });
        }
    },[])


    let handleApplicationChosen = e =>{
        settings.server.app_proxy.setApplication(e).then(()=>{
            let app = applications[e];
            dispatch(setSetting(["application", e]));
            let tabs = Object.values(app.tabs);
            dispatch(loadTabs(tabs))
            initializeRegisterStore(tabs);
        });
    };

    let initializeRegisterStore = (tabs) =>{

        Promise.all(tabs.map((tab) =>{
            if(tab.user_accessible && tab.type==="Registers"){
                return settings.server.periph_proxy.getPeripheralRegisters(tab.tab_id);
            }
            return 'Not Needed';
        })).then((result) =>{
                result.map((item) => {
                    if(item!=='Not Needed'){
                        dispatch(loadRegisters(item.peripheral_name, item.registers))
                    }
                    return null
                });
                set_init_phase(states.RESOURCE_LOADING);
                loadResources();
            }
        );

    };

    let loadResources = () => {
        settings.server.app_proxy.getApplicationParameters();
        settings.server.plot_proxy.getChannelsInfo();
        dispatch(loadTabs([{
            name: "Plot",
            tab_id: "plot",
            type: "Scope",
            user_accessible: true
        }]))
        dispatch(loadTabs([{
            name: "Script manager",
            tab_id: "script_manager",
            type: "script_manager",
            user_accessible: true
        }]))
        dispatch(loadTabs([{
            name: "Peripherals manager",
            tab_id: "peripherals_manager",
            type: "peripherals_manager",
            user_accessible: true
        }]))
        dispatch(loadTabs([{
            name: "Applications manager",
            tab_id: "applications_manager",
            type: "applications_manager",
            user_accessible: true
        }]));
        set_init_phase(states.NORMAL)
    };

    switch (init_phase) {
        case states.APP_CHOICE:
            return (
                <div className="App">
                    <ApplicationChooser done={handleApplicationChosen}/>

                </div>
            );
        case states.NORMAL:

            if(!plot.loading_done){
                return(
                    <></>
                )
            } else {
                return (
                    <div className="App">
                            <ApplicationLayout sidebarNeeded={settings.current_view_requires_sidebar}>
                                <Navbar tabs={tabs}/>
                                {tabs.map((tab, i) => {
                                    if(tab.user_accessible){
                                        return(
                                            <Route
                                                key={tab.tab_id}
                                                path={'/'+tab.tab_id}
                                                exact
                                                render={(props) => <TabContent className="main_content_tab" tab={tab}/>}
                                            />

                                        )
                                    } else {
                                        return null;
                                    }
                                })}
                                <Sidebar />
                            </ApplicationLayout>
                        <Route
                            path={'/script_creator'}
                            exact
                            render={(props) => <ScriptsCreator />}
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

export default AuthApp;
