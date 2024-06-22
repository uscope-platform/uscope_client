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
import React from 'react';
//       REDUX IMPORTS
import {useDispatch, useSelector} from "react-redux";
import {setSetting} from "../redux/Actions/SettingsActions";


import {initialize_channels} from "../redux/Actions/plotActions";
import ApplicationChooserView from "./Common_Components/ApplicationChooserView";

import {
    up_application,
    create_plot_channel
} from "../client_core"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let ApplicationChooser = (props) =>{

    const applications = useSelector(state => state.applications);
    const dispatch = useDispatch();


    let handleApplicationChosen = async e =>{
        let app = new up_application(applications[e]);
        try {
            let failures = await app.set_active();
            if(failures.length !== 0){
                toast.error("LOADING FAILED FOR THE FOLLOWING CORES: " + failures.join(", "));
                return;
            }
            dispatch(setSetting(["selected_application", e]));
        }catch (error){
            console.log("Error: error while choosing application");
        }
        dispatch(setSetting(["application", e]));
        initializePlotState(app);
        props.choice_done();
    };

    let initializePlotState = (app) =>{


        let [channels_list, group ] = app.get_scope_setup_info();
        dispatch(setSetting(["default_ch_group", group]));

        let ch_obj = [];
        for(let channel of channels_list){
            ch_obj.push(create_plot_channel(channel))
        }
        dispatch(initialize_channels(ch_obj));

    }

    return (
        <div className="App">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <ApplicationChooserView done={handleApplicationChosen}/>
        </div>
    );

}

export default ApplicationChooser;
