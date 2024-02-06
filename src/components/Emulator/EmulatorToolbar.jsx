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

import {ColorTheme} from "../UI_elements";
import {Tooltip} from "react-tooltip";
import {MdAdd, MdBuild, MdConstruction, MdDownload, MdPlayArrow} from "react-icons/md";

let  EmulatorToolbar = props =>{

    return(
        <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
            <div key="add_icon" id="add_icon">
                <MdAdd onClick={props.onAdd} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                       color={ColorTheme.icons_color}/>
                <Tooltip anchorSelect="add_icon" content={"Add Core"} place="top"/>
            </div>
            <div key="build" id="build">
                <MdDownload onClick={props.onBuild} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                         color={ColorTheme.icons_color}/>
                <Tooltip anchorSelect="build" content={"Build"} place="top"/>
            </div>
            <div key="run" id="run">
                <MdPlayArrow onClick={props.onRun} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                             color={ColorTheme.icons_color}/>
                <Tooltip anchorSelect="run" content={"Run"} place="top"/>
            </div>
            <div key="deploy" id="deploy">
                <MdConstruction onClick={props.onDeploy} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                             color={ColorTheme.icons_color}/>
                <Tooltip anchorSelect="deploy" content={"Deploy"} place="top"/>
            </div>
        </div>
    );
};

export default EmulatorToolbar;
