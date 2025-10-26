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
import {ColorTheme, SelectField} from "#UI/index.js";
import { MdPlayArrow, MdWrapText, MdStart} from "react-icons/md";
import {Tooltip} from "react-tooltip";
import type {SimpleStringOption} from "#interfaces/index.js";

interface DebuggerControlsProps {
    run: () => void,
    step: () => void,
    resume: () => void,
    select_types: (type: string) => void,
}

let  DebuggerControls = (props: DebuggerControlsProps) =>{

    let handle_types_select = (val: SimpleStringOption | null)=>{
        if(val === null) return;
        props.select_types(val.value)
    }

    return (
        <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
            <SelectField<SimpleStringOption>
                defaultValue={{value: "float", label: "float"}}
                name="type_selector"
                onChange={handle_types_select}
                options={[
                    {value:"float",label:"float"},
                    {value:"int",label:"int"}
                ]}
            />
            <div key="run" id="run">
                <MdPlayArrow onClick={props.run} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                             color={ColorTheme.icons_color}/>
                <Tooltip anchorSelect="run" content={"run"} place="top"/>
            </div>
            <div key="step" id="step">
                <MdWrapText onClick={props.step} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
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
