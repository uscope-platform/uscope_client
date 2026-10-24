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

import React from 'react';

import {Toolbar, ToolbarButton, ToolbarSeparator} from "#UI/index.js";
import {
    MdCode,
    MdMemory,
    MdPlayArrow,
    MdRocketLaunch
} from "react-icons/md";

interface EmulatorToolbarProps {
    onEdit: () => void;
    onRun: () => void;
    onDeploy: () => void;
    onHardwareSim: () => void;
    enable: {
        edit: boolean,
        run: boolean,
        hw_sim: boolean,
        deploy: boolean,
    }
}

let  EmulatorToolbar = (props: EmulatorToolbarProps) =>{
    return (
        <Toolbar>
            <ToolbarButton label="Run" tooltip="Run the emulation" icon={<MdPlayArrow size="1.5em"/>} enabled={props.enable.run} onClick={props.onRun}/>
            <ToolbarSeparator/>
            <ToolbarButton label="Program" tooltip="Edit Program" icon={<MdCode size="1.5em"/>} enabled={props.enable.edit} onClick={props.onEdit}/>
            <ToolbarButton label="Deploy" icon={<MdRocketLaunch size="1.5em"/>} enabled={props.enable.deploy} onClick={props.onDeploy}/>
            <ToolbarButton label="HW sim" tooltip="Download HW simulation files" icon={<MdMemory size="1.5em"/>} enabled={props.enable.hw_sim} onClick={props.onHardwareSim}/>
        </Toolbar>
    );
};

export default EmulatorToolbar;
