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

import Sidebar from "./components/Sidebar/Sidebar";
import OnboardingView from "./components/Onboarding";

import {initialize_scripting_engine, refresh_caches, up_application} from "./client_core";
import {Routes} from "react-router";
import {addApplication} from "./redux/Actions/applicationActions";

import { Responsive, WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {UIPanel} from "./components/UI_elements/panels/UIPanel";

const ResponsiveGridLayout = WidthProvider(Responsive);

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
                    let app = up_application.construct_empty("default");
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

    let populate_views = () => {
        let local_views = [];
        let role_mapping = {admin:1, user:2, operator:3};
        let role = role_mapping[settings.user_role]
        if(role<=3){
            local_views.push({
                name: "Plot",
                peripheral_id: "plot",
                type: "Scope"
            });
        }
        if(role<=2){
            local_views.push({
                name: "Script manager",
                peripheral_id: "script_manager",
                type: "script_manager"
            });
            local_views.push({
                name: "Applications manager",
                peripheral_id: "applications_manager",
                type: "applications_manager"
            });
            local_views.push({
                name: "Program Manager",
                peripheral_id: "program_manager",
                type: "program_manager"
            });
            local_views.push({
                name: "Bitstream Manager",
                peripheral_id: "bitstream_manager",
                type: "bitstream_manager"
            });
        }
        if(role<=1){
            local_views.push({
                name: "Peripherals manager",
                peripheral_id: "peripherals_manager",
                type: "peripherals_manager"
            });
            local_views.push({
                name: "Platform Manager",
                peripheral_id: "platform_manager",
                type: "platform_manager"
            });
        }
        set_views(local_views);
    }


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
            return (
                <div className="App">
                    <ResponsiveGridLayout
                        className="layout"
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                        compactType='horizontal'
                    >
                        <div key="nav" data-grid={{x: 0, y: 0, w: 3, h: 10, static: true}}>
                            <Navbar views={views}/>
                        </div>
                        <UIPanel key="main" data-grid={{x: 3, y: 0, w: 16, h: 10}} level="level_1">
                            <Routes>
                                <Route key="plot" path='/' element={<TabContent className="main_content_tab" tab={views[0]}/>}/>
                                <Route key="script_manager" path='/script_manager' element={<TabContent className="main_content_tab" tab={views[1]}/>}/>
                                <Route key="applications_manager" path='/applications_manager' element={<TabContent className="main_content_tab" tab={views[2]}/>}/>
                                <Route key="program_manager" path='/program_manager' element={<TabContent className="main_content_tab" tab={views[3]}/>}/>
                                <Route key="bitstream_manager" path='/bitstream_manager' element={<TabContent className="main_content_tab" tab={views[4]}/>}/>
                                <Route key="peripherals_manager" path='/peripherals_manager' element={<TabContent className="main_content_tab" tab={views[5]}/>}/>
                                <Route key="platform_manager" path='/platform_manager' element={<TabContent className="main_content_tab" tab={views[6]}/>}/>
                            </Routes>
                        </UIPanel>
                        <UIPanel key="props" data-grid={{x: 19, y: 0, w: 5, h: 10}} level="level_1">
                            <Sidebar />
                        </UIPanel>
                    </ResponsiveGridLayout>
                </div>
            );
        default:
            return(
                <>
                </>
            )
    }

}

export default AuthApp;
