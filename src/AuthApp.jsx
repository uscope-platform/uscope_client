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
import {Route} from 'react-router-dom'
//       REDUX IMPORTS
import {useSelector} from "react-redux";

//      APP RELATED IMPORTS
import TabContent from "./components/TabContent";
import Navbar from "./components/Navbar";
import ApplicationChooser from "./components/AppChooser";

//////  STYLE IMPORTS
import './App.css';

import {initialize_scripting_engine, refresh_caches, up_application} from "./client_core";
import {Routes} from "react-router";
import {addApplication} from "./redux/Actions/applicationActions";

import {UIPanel} from "./components/UI_elements";
import PlatformManager from "./components/Managers/PlatformManager";
import {InterfaceParameters} from "./components/UI_elements/InterfaceParameters";


let operator_views = ["Scope"];
let user_views = ["Scripts", "Applications", "Programs", "Bitstreams", "Filters", "Emulator"];
let admin_views =["Peripherals", "Platform", "Settings"];


let AuthApp = (props) =>{

    const settings = useSelector(state => state.settings);
    const peripherals = useSelector(state => state.peripherals);
    const applications = useSelector(state => state.applications);

    const [views, set_views] = useState([]);

    const [app_stage, set_app_stage] = useState("WAITING");


    let app_choice_done = ()=>{
        populate_views();
        set_app_stage("NORMAL");
    };

    useEffect(()=>{
        if(props.needs_onboarding){
            set_app_stage("ONBOARDING");
        } else{
            refresh_caches().then((res) =>{
                if(res[0].status ==="valid"){
                    set_app_stage("APP_CHOICE");
                } else if(Object.keys(res[0].data).length !== 0) {
                    set_app_stage("APP_CHOICE");
                } else {
                    let app = up_application.construct_empty(1);
                    app.add_remote().then(()=>{
                        addApplication(app);
                        set_app_stage("APP_CHOICE");
                    })
                }

            });
            set_app_stage("RESOURCE_LOADING");
        }

    },[props.needs_onboarding])

    useEffect(()=>{
        if(settings.application)
            initialize_scripting_engine(applications[settings.application], peripherals)
    }, [settings.application, peripherals, applications])

    let construct_routes = () =>{
        let routes = [];
        for(const v in views){
            let route = "/";
            if(v!=='scope'){
                route += views[v].type;
            }
            routes.push(<Route key={views[v].type} path={route} element={<TabContent className="main_content_tab" tab={views[v]}/>}/>,)
        }

        return(routes);
    }

    let populate_views = () => {
        let local_views = {};
        let role_mapping = {admin:1, user:2, operator:3};
        let role = role_mapping[props.user_role]

        let selected_views;
        if(role<=3){
            selected_views = operator_views;
        }
        if(role<=2){
            selected_views = [...selected_views, ...user_views];
        }
        if(role<=1){
            selected_views = [...selected_views, ...admin_views];
        }

        for(const view of selected_views){
            local_views[view.toLocaleLowerCase()]  = {
                name: view,
                type: view.toLocaleLowerCase(),
            };
        }
        set_views(local_views);
    }



    switch (app_stage) {
        case "ONBOARDING":
            return(
                <div className="App">
                    <PlatformManager  onboarding onboarding_done={props.onboarding_done} />
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
            return (
                <div className="App">
                    <div style={{display: "flex", gap: InterfaceParameters.main_window.columns_gap}}>
                        <div style={{
                            minWidth: InterfaceParameters.main_window.columns_min_widths[0],
                            height:"1000px"
                        }} key="nav">
                            <Navbar views={views}/>
                        </div>
                        <UIPanel key="main"
                                 style={{
                                     padding:InterfaceParameters.main_window.padding,
                                     minWidth:InterfaceParameters.main_window.columns_min_widths[1],
                                     flexGrow:6,
                                     height:"1000px"
                        }} level="level_1">
                            <Routes>
                                {construct_routes()}
                            </Routes>
                        </UIPanel>
                    </div>
                </div>
            );
        default:
            return (
                <>
                </>
            )
    }

}

export default AuthApp;
