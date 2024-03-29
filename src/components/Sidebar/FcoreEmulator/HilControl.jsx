// Copyright 2023 Filippo Savi
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

import React, {useCallback} from 'react';
import {SimpleContent, UIPanel} from "../../UI_elements";
import {Responsive, WidthProvider} from "react-grid-layout";
import TriggerControls from "../Plot/TriggerControls";
import {download_plot} from "../../../client_core";
import {useDispatch, useStore} from "react-redux";
import {setSetting} from "../../../redux/Actions/SettingsActions";


let  HilControl = props =>{
    const dispatch = useDispatch();

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const handle_download = useCallback(()=>{
        dispatch(setSetting(["download_hil_data", true]));
    }, [])

    if(props.enabled){
        return(
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                useCSSTransforms={false}
            >
                <UIPanel key="trigger" data-grid={{x: 0, y: 0, w: 24, h: 2.2, static: true}} level="level_2">
                    <SimpleContent name="Trigger and Acquisition" content={
                        <TriggerControls  onPlay={props.onStart} onPause={props.onPause} onStop={props.onStop} onDownload={handle_download}/>
                    }/>
                </UIPanel>
            </ResponsiveGridLayout>
        );
    }


};

export default HilControl;
