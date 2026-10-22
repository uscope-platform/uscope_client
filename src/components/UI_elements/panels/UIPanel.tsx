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



import React from 'react';
import type {HTMLAttributes} from 'react';
import { styled } from 'goober';
import { css } from 'goober';
import {ColorTheme} from "../ColorTheme.js";
import {Pane, use_split_pane} from "../Layouts/Splitter.js";
import type {PaneProps} from "../Layouts/Splitter.js";

interface UIPanelProps extends PaneProps, HTMLAttributes<HTMLDivElement> {
    level: keyof typeof ColorTheme.background;
    width?: number | string | undefined;
}

const panel_class = (level: UIPanelProps["level"]) => css`
  border-radius: 5px;
  overflow:hidden;
  display: flex;
  flex-direction: column;
  background: ${ColorTheme.background[level]};
  border-color: ${ColorTheme.background.borders};
  border-width: 2px;
  border-style:solid;
`;

/// Inside a SplitGroup the panel is one of its resizable panes, the size props then apply
export const UIPanel = ({level, width, id, default_size, min_size, max_size, ...rest}: UIPanelProps) => {
    const in_split = use_split_pane();
    const class_name = panel_class(level);
    if(in_split){
        return <Pane id={id} default_size={default_size} min_size={min_size} max_size={max_size} className={class_name} {...rest}/>;
    }
    return <div id={id} className={class_name} {...rest}/>;
};





interface PanelTitleProps {
    selected: boolean;
}

export const PanelTitle = styled<'div', PanelTitleProps>('div')(({ selected }) => `
  overflow:hidden;
  flex-shrink: 0;
  width: fit-content;
  cursor: default;
  border-color: ${selected ? ColorTheme.background.accents : "#43434300"};
  border-bottom-width: 3px;
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
  border-style:solid;
`);



interface ContentDivProps {
    height?: number | string| undefined;
}

export const ContentDiv = styled<'div', ContentDivProps>('div')(({ height }) => `
  overflow-y:auto;
  overflow-x: hidden;
  // lets a panel with a fixed height, like the ones of a splitter, shrink it and scroll
  min-height: 0;
  border-style:solid;
  border-color: ${ ColorTheme.background.borders};
  border-bottom-width: 0;
  border-top-width: 3px;
  border-left-width: 0;
  border-right-width: 0;
  height: ${height ? height : "100%"};
`);