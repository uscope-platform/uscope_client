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
import { css } from 'goober';
import {ColorTheme} from "../ColorTheme.js";
import {Pane} from "../Layouts/Pane.js";
import type {PaneProps} from "../Layouts/Pane.js";
import {useIsPane} from "../Layouts/GroupContext.js";

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

/// Inside a PaneGroup the panel is one of its resizable panes, that can be folded to its title: the size props then apply
export const UIPanel = ({level, width, id, default_size, min_size, max_size, collapsible = true, ...rest}: UIPanelProps) => {
    const in_group = useIsPane();
    const class_name = panel_class(level);
    if(in_group){
        return <Pane id={id} default_size={default_size} min_size={min_size} max_size={max_size} collapsible={collapsible} className={class_name} data-ui-panel="" {...rest}/>;
    }
    return <div id={id} className={class_name} data-ui-panel="" {...rest}/>;
};





interface ContentDivProps extends HTMLAttributes<HTMLDivElement> {
    height?: number | string| undefined;
    min_height?: number | string | undefined;
}

const content_class = (height: ContentDivProps["height"], min_height: ContentDivProps["min_height"]) => css`
  overflow-y: auto;
  overflow-x: hidden;
  /* lets a panel with a fixed height, like the ones of a PaneGroup, shrink it and scroll */
  min-height: ${min_height ?? 0};
  height: ${height ? height : "100%"};
`;

/// What is under the title bar of a panel
export const ContentDiv = ({height, min_height, ...rest}: ContentDivProps) => (
    <div className={content_class(height, min_height)} {...rest}/>
);
