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
import {ColorTheme} from "../../UI_elements"

import {useSelector} from "react-redux";

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { autocompletion } from '@codemirror/autocomplete';
import {
    autocompletion_engine, up_script
} from "../../../client_core";
import {MdSave} from "react-icons/md";
import {Tooltip} from "react-tooltip";


let ScriptsEditor = props =>{
    const scripts_store = useSelector(state => state.scripts);
    const settings = useSelector(state => state.settings);
    const [editor_content, set_editor_content] = useState("");

    const [dirty, set_dirty] = useState(false);

    let handle_change = (newValue) => {
        set_dirty(true);
        set_editor_content(newValue);
    };

    useEffect(()=>{
        let script =Object.values(scripts_store).find(x => x.id === settings.selected_script);
        if(typeof script !== 'undefined' && script !== null){
            set_editor_content(script.script_content);
        }
    },[settings.selected_script])

    function registers_completion(context) {
        let line = context.matchBefore(/[a-zA-Z0-9_\.]+/)
        let word = context.matchBefore(/\w*/)
        let options = autocompletion_engine(line, context.explicit);
        return {
            from: word.from,
            options: options
        }
    }

    let handle_save = ()=> {
        let script = new up_script(props.script);
        script.edit_field("script_content", editor_content).then(()=>{
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
                    <Tooltip anchorId="save_icon" content="Save Program" place="top" />
                </div>
            </div>
            <CodeMirror
                value={editor_content}
                width='auto'
                theme={dracula}
                extensions={[javascript({ jsx: true }),autocompletion({override: [registers_completion]})]}
                onChange={handle_change}

            />
        </div>
    );


}

export default ScriptsEditor;


