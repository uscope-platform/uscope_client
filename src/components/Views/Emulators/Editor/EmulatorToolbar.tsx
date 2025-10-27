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

import {ColorTheme, DeleteButton} from "#UI/index.js";
import {Tooltip} from "react-tooltip";
import {
    MdAdd,
    MdArticle,
    MdConstruction,
    MdSimCardDownload,
    MdPlayArrow,
    MdContentCopy
} from "react-icons/md";

interface EmulatorToolbarProps {
    onAdd: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onCopy: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onEdit: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onRun: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onDeploy: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onHardwareSim: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
    onDelete: () => void;
    enable: {
        add: boolean,
        copy: boolean,
        edit: boolean,
        run: boolean,
        hw_sim: boolean,
        deploy: boolean,
        delete: boolean,
    }
}

let  EmulatorToolbar = (props: EmulatorToolbarProps) =>{

    let render_add = () =>{
        let handle_click = (event:React.MouseEvent<SVGElement, MouseEvent>) =>{
            if(props.enable.add) {
                props.onAdd(event);
            }
        };
        let icon_color = props.enable.add ? ColorTheme.icons_color : ColorTheme.disabled_icon_color;
        return (
            <div key="add_icon" id="add_icon">
                <MdAdd onClick={handle_click} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                       color={icon_color}/>
                <Tooltip anchorSelect="add_icon" content={"Add Core"} place="top"/>
            </div>
        )
    }

    let render_copy = () => {
        let handle_click = (event:React.MouseEvent<SVGElement, MouseEvent>) =>{
            if(props.enable.copy) {
                props.onCopy(event);
            }
        };
        let icon_color = props.enable.copy ? ColorTheme.icons_color : ColorTheme.disabled_icon_color;
        return (
            <div key="copy_icon" id="copy_icon">
                <MdContentCopy onClick={handle_click} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                       color={icon_color}/>
                <Tooltip anchorSelect="copy_icon" content={"Copy Core"} place="top"/>
            </div>
        )

    }

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
                <Tooltip anchorSelect="edit" content={"Edit Program"} place="top"/>
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
                <Tooltip anchorSelect="run" content={"Run"} place="top"/>
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
                <Tooltip anchorSelect="deploy" content={"Deploy"} place="top"/>
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
                <Tooltip anchorSelect="hw_sim" content={"Download HW simulation files"} place="top"/>
            </div>
        )
    }

    let render_delete= () => {
        return (<DeleteButton enable={props.enable.delete} onRemove={props.onDelete}/>)
    }


    return (
        <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
            {render_add()}
            {render_copy()}
            {render_edit()}
            {render_run()}
            {render_deploy()}
            {render_hw_sim()}
            {render_delete()}

        </div>
    );
};

export default EmulatorToolbar;
