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

import React, {useState} from "react";
import AceEditor from "react-ace";
import {Button} from "../../UI_elements"

import "ace-builds/webpack-resolver";
import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/theme-dracula";
import "ace-builds/src-min-noconflict/ext-language_tools"
import {useSelector} from "react-redux";
import styled from "styled-components";

import {up_script} from "../../../client_core/data_models/up_script";

const Title = styled.h1`
  margin-right: auto;
  margin-left: auto;
`
const Editor = styled(AceEditor)`
    * {
        font-family: inherit;
    }
`;


let ScriptsEditor = props =>{
    const scripts_store = useSelector(state => state.scripts);
    const settings = useSelector(state => state.settings);
    const [editor_content, set_editor_content] = useState("");

    let handle_change = (newValue) => {
        set_editor_content(newValue);
    };

    let handle_submit = (event) => {
        let script = new up_script(Object.values(scripts_store).find(x => x.id === settings.selected_script));
        script.set_content(editor_content).then(()=>{
            props.done();
        });
    };

    let handle_load = (editor) => {
        let script =Object.values(scripts_store).find(x => x.id === settings.selected_script);
        if(typeof script !== 'undefined' && script !== null){
            editor.setValue(script.script_content);
            set_editor_content(script.script_content);
        }
    };

    return(
        <>
            <Title>{settings.script_editor_title}</Title>
            <Editor
                mode="javascript"
                theme="dracula"
                width='auto'
                showPrintMargin={false}
                onChange={handle_change}
                onLoad={handle_load}
                name="UNIQUE_ID_OF_DIV"
                value={editor_content}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true
                }}
            />
            <Button variant="success" onClick={handle_submit}>Submit</Button>
        </>
    );


}

export default ScriptsEditor;


