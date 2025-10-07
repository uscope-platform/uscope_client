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



let LegendItem = function (props) {
    let size = props.size ? props.size : 10;
    let color = props.color ? props.color : '#FFF';

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px' }}>
            <div
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    marginRight: '8px',
                    borderRadius: '2px',
                    border: '1px solid #ddd'
                }}
            />
            <span style={{ fontSize: '18px', fontWeight:'bold' }}>{props.label}</span>
        </div>
    );
};
export default LegendItem;
