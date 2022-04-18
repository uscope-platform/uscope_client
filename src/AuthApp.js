// Copyright 2021 University of Nottingham Ningbo China
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//       REACT IMPORTS
import React, {useEffect, useState} from 'react';
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
import {create_application} from "./utilities/ApplicationUtilities";

import {refresh_caches} from "./client_core";

let AuthApp = (props) =>{

    const views = useSelector(state => state.views);
    const plot = useSelector(state => state.plot);
    const settings = useSelector(state => state.settings);
    const applications = useSelector(state => state.applications);

    const [app_stage, set_app_stage] = useState("WAITING");

    let app_choice_done = ()=>{
        set_app_stage("NORMAL");
    };

    useEffect(()=>{
        if(props.needs_onboarding){
            set_app_stage("ONBOARDING");
        } else{
            refresh_caches();
            set_app_stage("RESOURCE_LOADING");
        }

    },[props.needs_onboarding])


    useEffect(()=>{
        if(settings.loaded_peripherals && settings.loaded_scripts &&settings.loaded_applications && settings.loaded_programs && settings.loaded_bitstreams){
            if(Object.keys(applications).length !== 0){
                set_app_stage("APP_CHOICE");
            }else {
                let app = create_application("default");
                settings.server.app_proxy.createApplication(app).then(data =>{
                    set_app_stage("APP_CHOICE");
                });
            }
        }
    },[settings.loaded_applications, settings.loaded_peripherals, settings.loaded_programs, settings.loaded_scripts, settings.loaded_bitstreams])


    switch (app_stage) {
        case "ONBOARDING":
            return(
                <div className="App">
                    <OnboardingView onboarding_done={props.onboarding_done} />
                </div>
            );

        case "RESOURCE LOADING":
            return(
                <></>
            );

        case "APP_CHOICE":
            return (
                <div className="App">
                    <ApplicationChooser choice_done={app_choice_done}/>
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
