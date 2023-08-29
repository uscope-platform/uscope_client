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



let  BandPass = props =>{
    return (
        <svg
            height="24"
            viewBox="0 0 24 24"
            width="24"
            version="1.1"
            id="band_pass"
            xmlns="http://www.w3.org/2000/svg"
            onClick={e => props.onClick(e)}
        >
            <path
                fill={props.color}
                stroke={props.color}
                fillOpacity={1}
                strokeWidth={1.76267}
                strokeOpacity={1}
                d="M 14.519531 5.296875 C 13.021214 5.2944747 11.082211 5.3075611 9.1777344 5.3242188 C 5.2793337 6.3563416 2.7792969 19.802734 2.7792969 19.802734 L 14.195312 19.900391 L 21.388672 19.839844 C 21.388672 19.839844 18.686147 5.303545 14.519531 5.296875 z "
                id="band_pass" />
        </svg>
    );
};

export default BandPass;
