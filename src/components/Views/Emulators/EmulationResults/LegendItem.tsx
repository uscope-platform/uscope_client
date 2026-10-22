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
import {styled} from "goober";
import {ColorTheme} from "#UI/ColorTheme.js";

const Item = styled('div')`
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.15em 0.7em 0.15em 0.55em;
  border: 1px solid ${ColorTheme.background.borders};
  border-radius: 9999px;
  background: ${ColorTheme.background.level_3};
  font-size: 0.8rem;
  white-space: nowrap;
`

const Swatch = styled('span')`
  width: 0.65em;
  height: 0.65em;
  border-radius: 50%;
`

interface LegendItemProps {
    color?: string;
    label: string;
}

let LegendItem = function (props: LegendItemProps) {
    return (
        <Item>
            <Swatch style={{backgroundColor: props.color ?? '#FFF'}}/>
            {props.label}
        </Item>
    );
};
export default LegendItem;
