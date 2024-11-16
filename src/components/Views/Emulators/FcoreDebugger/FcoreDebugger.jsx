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


import React from 'react';
import {Fcore} from "./FcoreLanguage.js";
import TextEditor from "../../../UI_elements/TextEditor.jsx";
import DebuggerControls from "./DebuggerControls";

let  FcoreDebugger = props =>{


    let handle_run = ()=>{

    }

    let handle_stop = () =>{

    }

    let handle_step = () =>{

    }

    let handle_resume = () =>{

    }

    return (
        <div>
            <DebuggerControls
                run={handle_run}
                stop={handle_stop}
                step={handle_step}
                continue={handle_resume}
            />
            <TextEditor
                tab_name="ASM Viewer"
                content={props.content}
                extensions={[Fcore()]}
            />
        </div>
    );
};

export default FcoreDebugger;
