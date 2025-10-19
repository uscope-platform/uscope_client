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
import {ColorTheme} from "#UI";



let  BandStop = props =>{
    return (
        <svg
            height="24"
            viewBox="0 0 24 24"
            width="24"
            version="1.1"
            id="bs"
            xmlns="http://www.w3.org/2000/svg"
            onClick={e => props.onClick(e)}
        >
            <path
                fill={props.active?ColorTheme.icons_color:ColorTheme.inactive_icons_color}
                stroke={props.active?ColorTheme.icons_color:ColorTheme.inactive_icons_color}
                fillOpacity={1}
                strokeWidth={1.76267}
                strokeOpacity={1}
                d="m 3.2493211,4.5546317 c 0,0 -0.1677916,-0.027795 2.8933025,-0.021002 3.0610951,0.00681 4.0924044,14.7310163 4.0924044,14.7310163 l -7.1350115,0.02113 z"
                id="bs" />
            <path
                fill={props.active?ColorTheme.icons_color:ColorTheme.inactive_icons_color}
                stroke={props.active?ColorTheme.icons_color:ColorTheme.inactive_icons_color}
                fillOpacity={1}
                strokeWidth={1.76267}
                strokeOpacity={1}
                d="m 21.231274,4.5693727 c 0,0 0.167792,-0.027795 -2.893302,-0.021002 -3.061095,0.00681 -4.092404,14.7310163 -4.092404,14.7310163 l 7.135011,0.02113 z"
                id="bs" />

        </svg>
    );
};

export default BandStop;
