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
import {Button} from "../../UI_elements"

import {useSelector} from "react-redux";

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { autocompletion } from '@codemirror/autocomplete';
import {
    autocompletion_engine
} from "../../../client_core";


let ScriptsEditor = props =>{
    const scripts_store = useSelector(state => state.scripts);
    const settings = useSelector(state => state.settings);
    const [editor_content, set_editor_content] = useState("");

    let handle_change = (newValue) => {
        set_editor_content(newValue);
    };

    let handle_submit = (event) => {
        props.script.edit_field("script_content", editor_content).then(()=>{
            props.done();
        });
    };

    useEffect(()=>{
        let script =Object.values(scripts_store).find(x => x.id === settings.selected_script);
        if(typeof script !== 'undefined' && script !== null){
            set_editor_content(script.script_content);
        }
    },[])

    function registers_completion(context) {
        let line = context.matchBefore(/[a-zA-Z0-9_\.]+/)
        let word = context.matchBefore(/\w*/)
        let options = autocompletion_engine(line, context.explicit);
        return {
            from: word.from,
            options: options
        }
    }

    return(
        <>
            <CodeMirror
                value={editor_content}
                width='auto'
                theme={dracula}
                extensions={[javascript({ jsx: true }),autocompletion({override: [registers_completion]})]}
                onChange={handle_change}
            />
            <Button variant="success" onClick={handle_submit}>Submit</Button>
        </>
    );


}

export default ScriptsEditor;


