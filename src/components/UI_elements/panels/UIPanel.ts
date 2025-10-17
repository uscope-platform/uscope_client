// Copyright 2021 Filippo Savi
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



import { styled } from 'goober';
import {ColorTheme} from "../ColorTheme.js";

interface UIPanelProps {
    level: keyof typeof ColorTheme.background;
}

export const UIPanel = styled("div")<UIPanelProps>`
  border-radius: 5px;
  overflow:hidden;
  display: flex;
  flex-direction: column;
  background: ${props => ColorTheme.background[props.level]};
  border-color: #434343;
  border-width: 2px;
  border-style:solid;
`

interface PanelTitleProps {
    selected: boolean;
}

export const PanelTitle = styled('div')<PanelTitleProps>`
  overflow:hidden;
  width: fit-content;
  cursor: default;
  border-color: ${props =>  props.selected ? ColorTheme.background.accents : "#43434300"};
  border-bottom-width: 3px;
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
  border-style:solid;
`

interface ContentDivProps {
    height: number | string;
}

export const ContentDiv = styled('div')<ContentDivProps>`
  overflow-y:auto;
  overflow-x: hidden;
  border-style:solid;
  border-color: ${() => ColorTheme.background.borders};
  border-bottom-width: 0;
  border-top-width: 3px;
  border-left-width: 0;
  border-right-width: 0;
  height: ${props => props.height ? props.height : "100%"};
`



