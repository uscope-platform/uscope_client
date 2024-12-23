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

import {ColorTheme} from "../../UI_elements";
import {Tooltip} from "react-tooltip";
import {MdAdd, MdArticle, MdConstruction, MdDownload, MdPlayArrow, MdVisibility} from "react-icons/md";

let  EmulatorToolbar = props =>{

    let render_add = () =>{
        let handle_click = (event) =>{
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

    let render_edit = () => {
        let handle_click = (event) =>{
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

    let render_build = () => {
        let handle_click = (event) =>{
            if(props.enable.build) {
                props.onBuild(event);
            }
        };
        let icon_color = props.enable.build ? ColorTheme.icons_color : ColorTheme.disabled_icon_color;
        return (
            <div key="build" id="build">
                <MdDownload onClick={handle_click} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                            color={icon_color}/>
                <Tooltip anchorSelect="build" content={"Build"} place="top"/>
            </div>
        )
    }

    let render_run = () => {
        let handle_click = (event) =>{
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
        let handle_click = (event) =>{
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

    let render_show = () => {
        let handle_click = (event) =>{
            if(props.enable.show) {
                props.onShow(event);
            }
        };
        let icon_color = props.enable.run ? ColorTheme.icons_color : ColorTheme.disabled_icon_color;
        return (
            <div key="show" id="show">
                <MdVisibility onClick={handle_click} size={ColorTheme.icons_size} style={{marginLeft: "0.3em"}}
                             color={icon_color}/>
                <Tooltip anchorSelect="show" content={"Show Assembly"} place="top"/>
            </div>
        )
    }

    return (
        <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
            {render_add()}
            {render_edit()}
            {render_build()}
            {render_run()}
            {render_deploy()}
            {render_show()}
        </div>
    );
};

export default EmulatorToolbar;
