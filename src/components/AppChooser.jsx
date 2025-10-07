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

import ApplicationChooserView from "./Common_Components/ApplicationChooserView";

import {
    up_application,
} from "@client_core"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let ApplicationChooser = (props) =>{


    let handleApplicationChosen = async e =>{
        let app = new up_application(props.applications[e]);
        try {
            let failures = await app.set_active();
            if(failures.length !== 0){
                toast.error("LOADING FAILED FOR THE FOLLOWING CORES: " + failures.join(", "));
                return;
            }
        }catch (error){
            toast.error("Error: error while choosing application: " + error);
            console.log(error);
            return;
        }
        props.choice_done(e);
    };

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
            <ApplicationChooserView
                applications={props.applications}
                done={handleApplicationChosen}/>
        </div>
    );

}

export default ApplicationChooser;
