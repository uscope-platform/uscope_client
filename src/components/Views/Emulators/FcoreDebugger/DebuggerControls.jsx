// Copyright 2024 Filippo Savi
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
import {ColorTheme} from "../../../UI_elements/index.jsx";
import {MdStop, MdPlayArrow, MdArrowRightAlt, MdStart} from "react-icons/md";
import {Tooltip} from "react-tooltip";

let  DebuggerControls = props =>{


    return (
        <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
            <div key="run" id="run">
                <MdPlayArrow onClick={props.run} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                             color={ColorTheme.icons_color}/>
                <Tooltip anchorSelect="run" content={"run"} place="top"/>
            </div>
            <div key="stop" id="stop">
                <MdStop onClick={props.stop} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                        color={ColorTheme.icons_color}/>
                <Tooltip anchorSelect="stop" content={"Stop"} place="top"/>
            </div>
            <div key="step" id="step">
                <MdArrowRightAlt onClick={props.step} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                                 color={ColorTheme.icons_color}/>
                <Tooltip anchorSelect="step" content={"Step over"} place="top"/>
            </div>
            <div key="resume" id="resume">
                <MdStart onClick={props.resume} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                                 color={ColorTheme.icons_color}/>
                <Tooltip anchorSelect="resume" content={"Resume"} place="top"/>
            </div>
        </div>
    );
};

export default DebuggerControls;
