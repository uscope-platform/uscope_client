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

import React from 'react';


import EnablesProperties from "./EnablesProperties";
import CaptureProperties from "./CaptureProperties";
import {DockLayout} from "rc-dock";

let  PlotSidebar = props =>{
    const defaultLayout = {
        dockbox: {
            mode: 'vertical',
            children: [
                {
                    tabs: [{id: "enable_properties", title:"Enable Properties", content: <EnablesProperties/>}],
                },
                {
                    tabs: [{id: "capture_properties", title:"Capture Properties", content:<CaptureProperties/>}],
                }
            ]
        }
    };


    return (
        <DockLayout defaultLayout={defaultLayout} style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10}}/>
    );

};

export default PlotSidebar;
