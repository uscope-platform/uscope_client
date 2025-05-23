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
import {ColorTheme} from "@UI";



let  HighPass = props =>{
    return (
        <svg
            height="24"
            viewBox="0 0 24 24"
            width="24"
            version="1.1"
            id="hp"
            xmlns="http://www.w3.org/2000/svg"
            onClick={e => props.onClick(e)}
        >
            <path
                fill={props.active?ColorTheme.icons_color:ColorTheme.inactive_icons_color}
                stroke={props.active?ColorTheme.icons_color:ColorTheme.inactive_icons_color}
                fillOpacity={1}
                strokeWidth={1.76267}
                strokeOpacity={1}
                d="m 21.603102,5.3601663 c 0,0 -7.788761,-0.1065188 -11.9553813,-0.099844 -4.16662,0.00667 -6.86859,14.5422277 -6.86859,14.5422277 l 18.8264733,0.161442 z"
                id="hp" />

        </svg>
    );
};

export default HighPass;
