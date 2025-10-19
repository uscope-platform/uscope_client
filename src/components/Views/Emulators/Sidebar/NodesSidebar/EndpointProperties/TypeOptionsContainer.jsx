// Copyright 2025 Filippo Savi
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
import {ColorTheme, Label} from "#UI";

let TypeOptionsContainer = props => {
    const {children, label} = props;

    return (
        <div style={{
            borderTopStyle: "solid", borderTopWidth: "thin", paddingTop: "0.2em", marginTop:"0.2em",
            borderColor: ColorTheme.disabled_icon_color, borderWidth: "2px"
        }}>
        <Label style={{color: ColorTheme.disabled_icon_color, marginBottom:"0.2em"}}>{label}</Label>
            {children}
        </div>
    );
};

export default TypeOptionsContainer;
