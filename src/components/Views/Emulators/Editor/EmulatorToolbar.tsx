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

import {ColorTheme} from "#UI/index.js";
import {Tooltip} from "#UI/Tooltip.js";
import {
    MdArticle,
    MdConstruction,
    MdSimCardDownload,
    MdPlayArrow
} from "react-icons/md";

interface EmulatorToolbarProps {
    onEdit: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onRun: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onDeploy: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onHardwareSim: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    enable: {
        edit: boolean,
        run: boolean,
        hw_sim: boolean,
        deploy: boolean,
    }
}

let  EmulatorToolbar = (props: EmulatorToolbarProps) =>{

    let render_edit = () => {
        let handle_click = (event:React.MouseEvent<SVGElement, MouseEvent>) =>{
            if(props.enable.edit){
                props.onEdit(event);
            }
        };
        let icon_color = props.enable.edit ? ColorTheme.icons_color : ColorTheme.disabled_icon_color;
        return (
            <div key="edit" id="edit">
                <MdArticle onClick={handle_click} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                           color={icon_color}/>
                <Tooltip anchorSelect="#edit" content={"Edit Program"} place="top"/>
            </div>
        )
    }

    let render_run = () => {
        let handle_click = (event:React.MouseEvent<SVGElement, MouseEvent>) =>{
            if(props.enable.run) {
                props.onRun(event);
            }
        };
        let icon_color = props.enable.run ? ColorTheme.icons_color : ColorTheme.disabled_icon_color;
        return (
            <div key="run" id="run">
                <MdPlayArrow onClick={handle_click} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                             color={icon_color}/>
                <Tooltip anchorSelect="#run" content={"Run"} place="top"/>
            </div>
        )
    }

    let render_deploy = () => {
        let handle_click = (event:React.MouseEvent<SVGElement, MouseEvent>) =>{
            if(props.enable.deploy){
                props.onDeploy(event);
            }
        };
        let icon_color = props.enable.deploy ? ColorTheme.icons_color : ColorTheme.disabled_icon_color;
        return (
            <div key="deploy" id="deploy">
                <MdConstruction onClick={handle_click} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                                color={icon_color}/>
                <Tooltip anchorSelect="#deploy" content={"Deploy"} place="top"/>
            </div>
        )
    }


    let render_hw_sim= () => {
        let handle_click = (event:React.MouseEvent<SVGElement, MouseEvent>) =>{
            if(props.enable.hw_sim) {
                props.onHardwareSim(event);
            }
        };
        let icon_color = props.enable.hw_sim ? ColorTheme.icons_color : ColorTheme.disabled_icon_color;
        return (
            <div key="hw_sim" id="hw_sim">
                <MdSimCardDownload onClick={handle_click} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                             color={icon_color}/>
                <Tooltip anchorSelect="#hw_sim" content={"Download HW simulation files"} place="top"/>
            </div>
        )
    }

    return (
        <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
            {render_edit()}
            {render_run()}
            {render_deploy()}
            {render_hw_sim()}
        </div>
    );
};

export default EmulatorToolbar;
