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
import {MdAdd} from "react-icons/md";
import {ColorTheme} from "#UI/index.js";

/// The row on top of the lists of the inputs, outputs, memories and files of a core, that adds an item to the list
let ListAddButton = (props: {label: string, onClick: () => void}) =>(
    <div
        onClick={props.onClick}
        style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4em",
            margin: "0.5em 0.5em 0",
            padding: "0.3em 0.5em",
            border: "1px dashed " + ColorTheme.background.bordersLight,
            borderRadius: "5px",
            cursor: "pointer",
            color: ColorTheme.icons_color,
        }}
    >
        <MdAdd size="1.2em"/>
        <span>{props.label}</span>
    </div>
);

export default ListAddButton;
