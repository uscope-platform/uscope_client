// Copyright 2023 Filippo Savi
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
import {ColorTheme, TextEditor} from "@UI";
import {MdSave} from "react-icons/md";
import {json} from "@codemirror/lang-json";
import {download_json} from "#client_core";



let SpecViewer = function (props) {

    const artifact = props.emulator.build();
    const artifact_string =  JSON.stringify(artifact, null, 4);

    let handle_download_json = ()=>{
        download_json(artifact, props.emulator.name + "_artifact");
    }

    return (
        <div style={{
            flexGrow:1,
            minWidth:0
        }}>
            <div style={{display: "flex", marginRight: "0.5em", justifyContent: "right"}}>
                <MdSave onClick={handle_download_json} size={ColorTheme.icons_size}/>
            </div>
            <TextEditor
                height="55em"
                content={artifact_string}
                extensions={[json()]}
            />
        </div>
    );
};


export default SpecViewer;
