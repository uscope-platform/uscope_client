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
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'

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


let AuthApp = (props) =>{

    const views = useSelector(state => state.views);
    const plot = useSelector(state => state.plot);
    const scripts = useSelector(state => state.scripts);
    const programs = useSelector(state => state.programs);
    const bitstreams = useSelector(state => state.bitstreams);
    const settings = useSelector(state => state.settings);
    const peripherals = useSelector(state => state.peripherals);
    const applications = useSelector(state => state.applications);

    const dispatch = useDispatch();
    const [app_stage, set_app_stage] = useState("WAITING");
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
                } else{
                    dispatch(setSetting([resource.loaded_flag, true]));
                }
            });
        }
    }

    let app_choice_done = ()=>{
        set_app_stage("NORMAL");
    };

    useEffect(()=>{
        let resources = [{
            key:'Applications-hash',
            proxy:settings.server.app_proxy,
            store:applications,
            loaded_flag:'loaded_applications'
        }, {
            key:'Peripherals-hash',
            proxy:settings.server.periph_proxy,
            store:peripherals,
            loaded_flag:'loaded_peripherals'
        }, {
            key:'Script-hash',
            proxy:settings.server.script_proxy,
            store:scripts,
            loaded_flag:'loaded_scripts'
        }, {
            key:'Programs-hash',
            proxy:settings.server.prog_proxy,
            store:programs,
            loaded_flag:'loaded_programs'
        }, {
            key:'Bitstreams-hash',
            proxy:settings.server.bitstream_proxy,
            store:bitstreams,
            loaded_flag:'loaded_bitstreams'
        }]
        if(props.needs_onboarding){
            set_app_stage("ONBOARDING");
        } else{
            for(let i of resources){
                load_resource(i);
            }
            set_app_stage("RESOURCE_LOADING");
        }

    },[])


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
                        <BrowserRouter>
                            <ApplicationLayout name="plot_tab" sidebarNeeded={settings.current_view_requires_sidebar}>
                                <Navbar views={views}/>
                                    <Switch>
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
                                    </Switch>
                                <Sidebar />
                            </ApplicationLayout>
                            <Redirect exact from="/" to="plot" />
                        </BrowserRouter>
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
