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
import {useSelector} from "react-redux";

let  PlotSidebar = props =>{

    const settings = useSelector(state => state.settings);

    let on_capture_start = (capture_length) => {
        settings.server.plot_proxy.setCapture(capture_length);
        setTimeout(on_capture_end, 500);
    };


    let on_capture_end = () => {
        settings.server.plot_proxy.get_captured_data().then((res) => {
            if(res['elapsed'] !== 0){
                setTimeout(on_capture_end, 1000);
            } else {
                let hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(res['data']);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'data.csv';
                hiddenElement.click();
            }
        });
    };

    return (
        <>
            <EnablesProperties/>
            <CaptureProperties done={on_capture_start} />
        </>
    );

};

export default PlotSidebar;
