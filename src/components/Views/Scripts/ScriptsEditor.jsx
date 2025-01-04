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
import {ColorTheme, TextEditor} from "@UI"

import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';
import {
    autocompletion_engine, up_script
} from "@client_core";
import {MdSave} from "react-icons/md";
import {Tooltip} from "react-tooltip";

let ScriptsEditor = props =>{
    const [editor_content, set_editor_content] = useState("");

    const [dirty, set_dirty] = useState(false);

    useEffect(()=>{
        if(typeof props.script !== 'undefined' && props.script !== null){
            set_editor_content(props.script.content);
        }
    },[props.script])

    let handle_change = (newValue) => {
        set_dirty(true);
        set_editor_content(newValue);
    };

    function registers_completion(context) {
        let line = context.matchBefore(/[a-zA-Z0-9_.]+/)
        let word = context.matchBefore(/\w*/)
        let options = autocompletion_engine(line, context.explicit);
        return {
            from: word.from,
            options: options
        }
    }

    let handle_save = ()=> {
        let script = new up_script(props.script);
        script.edit_field("content", editor_content).then(()=>{
            set_dirty(false);
        });
    }

    let handle_shortcuts = (event) =>{
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if((event.ctrlKey || event.metaKey) && charCode === 's') {
            event.preventDefault();
            handle_save()
        }
    }

    let save_color = dirty ? ColorTheme.icons_color:"gray";

    return(
        <div onKeyDown={handle_shortcuts}>
            <div style={{display:"flex", marginRight:"0.5em", justifyContent:"right"}}>
                <div id="save_icon">
                    <MdSave onClick={handle_save} size={ColorTheme.icons_size} style={{marginLeft:"0.3em"}} color={save_color}/>
                    <Tooltip content="Save Program" place="top" />
                </div>
            </div>
            <TextEditor
                content={editor_content}
                extensions={[javascript({ jsx: true }),autocompletion({override: [registers_completion]})]}
                onChange={handle_change}
            />
        </div>
    );


}

export default ScriptsEditor;


