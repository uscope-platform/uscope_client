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

import React, {useState, useEffect, useRef} from "react";
import AceEditor from "react-ace";
import {Button} from "../../UI_elements"

import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/theme-dracula";
import "ace-builds/src-min-noconflict/mode-c_cpp"
import styled from "styled-components";
import fCoreMode from "./fCorehas";

const Title = styled.h1`
  margin-right: auto;
  margin-left: auto;
`
const Editor = styled(AceEditor)`
    * {
        font-family: inherit;
    }
`;

let ProgramsEditor = props =>{
    const aceEditor = useRef(null)
    const [editor_content, set_editor_content] = useState("");
    const [language, set_language] = useState('');

    useEffect(()=>{
        if (aceEditor.current) {
            if(language ==="asm"){
                aceEditor.current.editor.getSession().setMode(new fCoreMode());
            } else if(language ==="C") {
                aceEditor.current.editor.getSession().setMode("ace/mode/c_cpp");
            }

        }

    },[language])

    let handle_change = (newValue) => {
        set_editor_content(newValue);
    };

    let handle_submit = (event) => {
        props.program.edit_field('program_content', editor_content).then(()=>{
            props.done();
        })
    };

    let handle_load = (editor) => {
        if(typeof props.program !== 'undefined' && props.program !== null){
            editor.setValue(props.program.program_content);
            set_editor_content(props.program.program_content);
            set_language(props.program.program_type);
        }

    };

    return(
        <>
            <Title>{props.program.name}</Title>
            <Editor
                ref={aceEditor}
                mode="text"
                width='auto'
                theme="dracula"
                showPrintMargin={false}
                onChange={handle_change}
                onLoad={handle_load}
                name="UNIQUE_ID_OF_DIV"
                value={editor_content}
                editorProps={{ $blockScrolling: true }}
            />
            <Button variant="success" onClick={handle_submit}>Submit</Button>
        </>
    );


}

export default ProgramsEditor;