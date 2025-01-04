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

import {cpp} from '@codemirror/lang-cpp'
import {Tooltip} from "react-tooltip";
import {MdSave, MdBuild} from 'react-icons/md'
import {ColorTheme, TextEditor} from "@UI";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { up_program} from "@client_core";
import LoadSelector from "./LoadSelector";


let ProgramsEditor = props =>{
    const [editor_content, set_editor_content] = useState('');
    const [dirty, set_dirty] = useState(false);


    useEffect(()=>{
        if(typeof props.program !== 'undefined' && props.program !== null){
            set_editor_content(props.program.content);
            set_dirty(false);
        }
    },[props.program])

    let handle_change = (newValue) => {
        set_dirty(true);
        set_editor_content(newValue);
    };

    let handle_save = () => {
        let program = new up_program(props.program);
        program.edit_field('content', editor_content).then(()=>{
            set_dirty(false);
        })
    };

    let handle_build = async () => {
        let prog = new up_program(props.program);
        let results = await prog.compile();
        if(results.status==="ok"){
            toast.success('✅ Compilation Successfull');
        } else if (results.status==="error"){
            toast.error(results.error);
        } else {
            toast.error("Compilation server error");
        }
    };

    let handle_load =async (core, application) => {
        let prog = new up_program(props.program);
        let result = await prog.load(core);
        if(result[0].status==="passed"){
            toast.success('✅ Program Loaded');
        } else if (result[0].status==="failed") {
            toast.error(result[0].error);
        }
    };



    let constructActionsBar = () =>{
        let save_color = dirty ? ColorTheme.icons_color:"gray";
        return(
            <div style={{display:"flex", marginRight:"0.5em", justifyContent:"right"}}>
                <div id="save_icon">
                    <MdSave onClick={handle_save} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={save_color}/>
                    <Tooltip anchorSelect="save_icon" content="Save Program" place="top" />
                </div>
                <div id="build_icon">
                    <MdBuild onClick={handle_build} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={ColorTheme.icons_color}/>
                    <Tooltip anchorSelect="build_icon" content="Compile Program" place="top" />
                </div>

                <div id="load_icon">
                    <LoadSelector
                        onLoad={handle_load}
                    />
                </div>
            </div>
        )
    }

    let handle_shortcuts = (event) =>{
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if((event.ctrlKey || event.metaKey) && charCode === 's') {
            event.preventDefault();
            handle_save()
        }
    }


    return(
        <div onKeyDown={handle_shortcuts}>
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

            <TextEditor
                content={editor_content}
                extensions={[cpp()]}
                onChange={handle_change}
            />
        </div>
    );


}
export default ProgramsEditor;