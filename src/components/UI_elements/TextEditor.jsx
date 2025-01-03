// Copyright 2024 Filippo Savi
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


import React from "react";

import CodeMirror from '@uiw/react-codemirror';
import {darcula} from '@uiw/codemirror-theme-darcula';
import 'react-toastify/dist/ReactToastify.css';

import {InterfaceParameters} from "./InterfaceParameters.js";

export let TextEditor = props => {

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flexGrow: 1,
            height: "100%"
        }}>
            <p>{props.tab_name}</p>
            <CodeMirror
                value={props.content}
                width='auto'
                height={props.height ? props.height: InterfaceParameters.programs.editorHeight}
                theme={darcula}
                basicSetup={{
                    syntaxHighlighting: true
                }}
                extensions={props.extensions}
                onChange={props.onChange}
            />
        </div>

    );


}