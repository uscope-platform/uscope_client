// Copyright 2021 Filippo Savi
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


import {ColorTheme, } from "../index"
import {MdNoteAdd, MdDownload, MdUpload} from "react-icons/md";
import {Tooltip} from "react-tooltip";

export let SideToolbar = (props) =>{
    let io_color = props.exportEnabled ? ColorTheme.icons_color:"gray";
    let click_handler = props.exportEnabled ? props.onExport:null;
    let export_tooltip = props.exportEnabled ? <Tooltip anchorId="export_icon" content={"Export "+ props.contentName} place="top" />:null;

    let render_icons = () =>{
        let ret = [];
        ret.push(
            <div key="add_icon" id="add_icon">
                <MdNoteAdd onClick={props.onAdd} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
                <Tooltip anchorId="add_icon" content={"Add "+ props.contentName} place="top" />
            </div>
        )
        ret.push(
            <div key="import_icon" id="import_icon">
                <MdUpload onClick={props.onImport} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
                <Tooltip anchorId="import_icon" content={"Import "+ props.contentName} place="top" />
            </div>
        )
        ret.push(
            <div key="export_icon" id="export_icon">
                <MdDownload onClick={click_handler} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={io_color}/>
                {
                    export_tooltip
                }
            </div>
        )
        return ret;
    }


    return(
        <div style={{display:"flex", marginRight:"0.5em", justifyContent:"right"}}>
            {render_icons()}
        </div>
    );
}
