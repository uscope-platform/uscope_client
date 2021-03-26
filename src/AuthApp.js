//       REACT IMPORTS
import React, {useEffect} from 'react';
import {Redirect, Route} from 'react-router-dom'
//       REDUX IMPORTS
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "./redux/Actions/SettingsActions";

//      APP RELATED IMPORTS
import TabContent from "./components/TabContent";
import Navbar from "./components/Navbar";

import ApplicationChooser from "./components/AppChooser";
//////  STYLE IMPORTS
import './App.css';

import {ApplicationLayout} from "./components/UI_elements";
import Sidebar from "./components/Sidebar/Sidebar";
import OnboardingView from "./components/Onboarding";


let AuthApp = (props) =>{

    const views = useSelector(state => state.views);
    const plot = useSelector(state => state.plot);
    const scripts = useSelector(state => state.scripts);
    const programs = useSelector(state => state.programs);
    const settings = useSelector(state => state.settings);
    const peripherals = useSelector(state => state.peripherals);
    const applications = useSelector(state => state.applications);

    const dispatch = useDispatch();


    let load_resource = (resource) =>{
        let digest = localStorage.getItem(resource.key);
        if(resource.store === undefined || digest === null){
            resource.proxy.load_all();
            resource.proxy.get_hash().then((res)=>{
                localStorage.setItem(resource.key, res);
            });
        } else{
            resource.proxy.get_hash().then((res)=>{
                if(digest!==res){
                    resource.proxy.load_all();
                    localStorage.setItem(resource.key, res);
                }
            });
        }
    }

    useEffect(()=>{
        let resources = [{
            key:'Applications-hash',
            proxy:settings.server.app_proxy,
            store:applications
        }, {
            key:'Peripherals-hash',
            proxy:settings.server.periph_proxy,
            store:peripherals
        }, {
            key:'Script-hash',
            proxy:settings.server.script_proxy,
            store:scripts
        }, {
            key:'Programs-hash',
            proxy:settings.server.prog_proxy,
            store:programs
        }]

        if(props.needs_onboarding){
            dispatch(setSetting(["app_stage", "ONBOARDING"]));
        } else{
            for(let i of resources){
                load_resource(i);
            }
            dispatch(setSetting(["app_stage", "APP_CHOICE"]));
        }





    },[])


    switch (settings.app_stage) {
        case "ONBOARDING":
            return(
                <div className="App">
                    <OnboardingView onboarding_done={props.onboarding_done} />
                </div>
            );
        case "APP_CHOICE":
            return (
                <div className="App">
                    <ApplicationChooser />
                </div>
            );
        case "NORMAL":

            if(!plot.loading_done){
                return(
                    <></>
                )
            } else {
                return (
                    <div className="App">
                            <ApplicationLayout name="plot_tab" sidebarNeeded={settings.current_view_requires_sidebar}>
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
