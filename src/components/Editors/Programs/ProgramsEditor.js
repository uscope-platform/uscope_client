// Copyright 2021 University of Nottingham Ningbo China
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

import React, {useState, useEffect} from "react";

import CodeMirror from '@uiw/react-codemirror';
import {cpp} from '@codemirror/lang-cpp'
import { dracula } from '@uiw/codemirror-theme-dracula';
import {Tooltip} from "react-tooltip";
import {MdSave, MdBuild, MdCable} from 'react-icons/md'
import {ColorTheme} from "../../UI_elements";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {up_program} from "../../../client_core";


let ProgramsEditor = props =>{
    const [editor_content, set_editor_content] = useState("");
    const [language, set_language] = useState('');

    useEffect(()=>{
        if(typeof props.program !== 'undefined' && props.program !== null){
            set_editor_content(props.program.program_content);
            set_language(props.program.program_type);
        }
    },[props.program])

    let handle_change = (newValue) => {
        set_editor_content(newValue);
    };

    let handle_save = (event) => {
        props.program.edit_field('program_content', editor_content).then(()=>{
        })
    };

    let handle_build = (event) => {
        let prog = new up_program(props.program);

        prog.compile().then((data)=>{
            for (let item of data){
                if(item.status==="passed"){
                    toast.success('✅ Compilation Successfull');
                } else if (item.status==="failed"){
                    toast.error(item.error);
                }
            }
        });

    };

    let handle_load = (event) => {
        let core_address = '0x83c00000';
        let prog = new up_program(props.program);
        prog.load(core_address).then();
    };



    let constructActionsBar = () =>{
        return(
            <div style={{display:"flex", marginRight:"0.5em", justifyContent:"right"}}>
                <div id="save_icon">
                    <MdSave onClick={handle_save} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
                    <Tooltip anchorId="save_icon" content="Save Program" place="top" />
                </div>
                <div id="build_icon">
                    <MdBuild onClick={handle_build} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
                    <Tooltip anchorId="build_icon" content="Compile Program" place="top" />
                </div>
                <div id="load_icon">
                    <MdCable onClick={handle_load} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
                    <Tooltip anchorId="load_icon" content="Load Program" place="top" />
                </div>
            </div>
        )
    }


    return(
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            {constructActionsBar()}
            <CodeMirror
                value={editor_content}
                width='auto'
                theme={dracula}
                extensions={[cpp()]}
                onChange={handle_change}
            />
        </div>
    );


}

export default ProgramsEditor;