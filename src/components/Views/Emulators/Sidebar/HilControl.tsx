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
import {ColorTheme, SimpleContent, UIPanel} from "#UI/index.js";
import TriggerControls from "../../Plot/Sidebar/TriggerControls.js";
import {MdSimCardDownload} from "react-icons/md";

interface HilControlProps {
    onDownloadHilData: (req: boolean)=> void,
    onDownlodHilSim: () =>{},
    onStart: () => void;
    onPause: () => void;
    onStop: () => void;
}

let  HilControl = (props: HilControlProps) =>{

    const handle_download = useCallback(()=>{
        props.onDownloadHilData(true);
    }, [])

    const handle_get_sim_file= useCallback(()=>{
        props.onDownlodHilSim();
    }, [])


    return(
        <div>
            <UIPanel key="trigger" style={{padding:10}} level="level_2">
                <SimpleContent name="Trigger and Acquisition">
                    <TriggerControls
                        acquisition_status={"unknown"}
                        showAcquisitionStatus={false}
                        onPlay={props.onStart}
                        onPause={props.onPause}
                        onStop={props.onStop}
                        onDownload={handle_download}
                    />
                </SimpleContent>
            </UIPanel>
            <UIPanel key="controls" style={{padding:10}} level="level_2">
                <SimpleContent name="Controls">
                    <MdSimCardDownload  id='play' size={ColorTheme.icons_size} color={ColorTheme.icons_color} onClick={handle_get_sim_file}/>
                </SimpleContent>
            </UIPanel>
        </div>
    );


};

export default HilControl;
