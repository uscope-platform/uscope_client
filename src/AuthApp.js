//       REACT IMPORTS
import React, {useEffect, useState} from 'react';
import {Redirect, Route} from 'react-router-dom'
//       REDUX IMPORTS
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "./redux/Actions/SettingsActions";
import {loadViews} from "./redux/Actions/ViewsActions";
import {loadRegisters} from "./redux/Actions/RegisterActions";
//      APP RELATED IMPORTS
import TabContent from "./components/TabContent";
import Navbar from "./components/Navbar";

import ApplicationChooser from "./components/Common_Components/ApplicationChooser";
//////  STYLE IMPORTS
import './App.css';


import {ApplicationLayout} from "./components/UI_elements";
import Sidebar from "./components/Sidebar/Sidebar";


const states = Object.freeze({
    START:   Symbol("start"),
    APP_CHOICE:  Symbol("app_choice"),
    RESOURCE_LOADING: Symbol("resource_loading"),
    NORMAL: Symbol("normal"),
});


let AuthApp = (props) =>{

    const views = useSelector(state => state.views);
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
            let peripherals = Object.values(app.peripherals);
            dispatch(loadViews(peripherals))
            initializeRegisterStore(peripherals);
        });
    };

    let initializeRegisterStore = (peripherals) =>{

        Promise.all(peripherals.map((tab) =>{
            if(tab.user_accessible && tab.type==="Registers"){
                return settings.server.periph_proxy.getPeripheralRegisters(tab.peripheral_id);
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
        ).catch((reason => {
            console.log(reason)
        }));

    };

    let loadResources = () => {
        settings.server.plot_proxy.getChannelsInfo();
        dispatch(loadViews([{
            name: "Plot",
            peripheral_id: "plot",
            type: "Scope",
            user_accessible: true
        }]))
        dispatch(loadViews([{
            name: "Script manager",
            peripheral_id: "script_manager",
            type: "script_manager",
            user_accessible: true
        }]))
        dispatch(loadViews([{
            name: "Peripherals manager",
            peripheral_id: "peripherals_manager",
            type: "peripherals_manager",
            user_accessible: true
        }]))
        dispatch(loadViews([{
            name: "Applications manager",
            peripheral_id: "applications_manager",
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
                                <Navbar views={views}/>
                                {views.map((tab, i) => {
                                    if(tab.user_accessible){
                                        return(
                                            <Route
                                                key={tab.peripheral_id}
                                                path={'/'+tab.peripheral_id}
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