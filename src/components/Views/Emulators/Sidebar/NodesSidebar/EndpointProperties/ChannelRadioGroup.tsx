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
import {Label, RadioGroup} from "#UI/index.js";

interface ChannelRadioGroupProps {
    count: number;
    selected: number;
    onSelect: (channel: number) => void;
}

/// The channel whose values the fields under it show and edit
let ChannelRadioGroup = (props: ChannelRadioGroupProps) => (
    <div>
        <Label>Channel</Label>
        <div style={{marginTop: "0.25em"}}>
            <RadioGroup
                name="channel"
                label="Channel"
                options={Array.from({length: props.count}, (_, channel) => ({label: String(channel), value: String(channel)}))}
                value={String(props.selected)}
                onChange={(value) => props.onSelect(parseInt(value))}
            />
        </div>
    </div>
);

export default ChannelRadioGroup;
