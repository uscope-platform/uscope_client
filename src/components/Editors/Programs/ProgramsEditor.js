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


import CodeMirror from '@uiw/react-codemirror';
import {cpp} from '@codemirror/lang-cpp'
import { dracula } from '@uiw/codemirror-theme-dracula';


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

    let handle_submit = (event) => {
        props.program.edit_field('program_content', editor_content).then(()=>{
            props.done();
        })
    };

    return(
        <>
            <CodeMirror
                value={editor_content}
                width='auto'
                theme={dracula}
                extensions={[cpp()]}
                onChange={handle_change}
            />
            <Button variant="success" onClick={handle_submit}>Submit</Button>
        </>
    );


}

export default ProgramsEditor;