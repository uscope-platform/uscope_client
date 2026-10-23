// Copyright 2026 Filippo Savi
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
import type {HTMLAttributes, ReactNode} from 'react';
import {css} from 'goober';
import {MdKeyboardArrowDown} from "react-icons/md";
import {ColorTheme} from "../ColorTheme.js";
import {usePanelFold} from "./FoldStore.js";

/// What a panel keeps when it is folded to its title
export const TITLE_BAR_HEIGHT = 38;

const bar_class = css`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    box-sizing: border-box;
    height: ${TITLE_BAR_HEIGHT}px;
    padding: 0 0.3em;
    background: ${ColorTheme.background.level_4};
    border-bottom: 1px solid ${ColorTheme.background.borders};
    /* what follows the bar in the panel is not shown while it is folded, and stays mounted */
    &[data-folded] ~ * {
        display: none;
    }
`;

const arrow_class = css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.9em;
    height: 1.9em;
    margin-right: 0.1em;
    padding: 0;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: ${ColorTheme.icons_color};
    cursor: pointer;
    & svg {
        transition: transform 0.15s;
    }
    &[aria-expanded="false"] svg {
        transform: rotate(-90deg);
    }
    &:hover {
        background: ${ColorTheme.background.level_5};
    }
    &:focus-visible {
        outline: 2px solid ${ColorTheme.background.accents};
    }
`;

interface TitleBarProps {
    /// names the panel for the PaneGroup that folds it, so it has to be different for every panel of the group;
    /// without it, or outside of a PaneGroup, there is no arrow and the panel cannot be folded
    name?: string | undefined;
    children: ReactNode;
}

/// The row of titles of a panel, with the arrow that folds it. A double click on the bar folds it too.
export const TitleBar = (props: TitleBarProps) => {
    const control = usePanelFold(props.name);
    return (
        <div
            className={bar_class}
            onDoubleClick={control?.toggle}
            data-title-bar=""
            data-folded={control?.collapsed ? "" : undefined}
        >
            {control && (
                <button
                    type="button"
                    className={arrow_class}
                    aria-label={control.collapsed ? "Expand" : "Collapse"}
                    aria-expanded={!control.collapsed}
                    onClick={control.toggle}
                    onDoubleClick={(e) => e.stopPropagation()}
                >
                    <MdKeyboardArrowDown size="1.4em"/>
                </button>
            )}
            {props.children}
        </div>
    );
};

const title_class = (selected: boolean, clickable: boolean) => css`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    box-sizing: border-box;
    height: 100%;
    padding: 0 0.7em;
    font-size: 0.92rem;
    font-weight: 600;
    white-space: nowrap;
    cursor: ${clickable ? "pointer" : "default"};
    opacity: ${selected ? 1 : 0.6};
    border-bottom: 2px solid ${selected ? ColorTheme.background.accents : "transparent"};
    &:hover {
        opacity: 1;
    }
`;

interface PanelTitleProps extends HTMLAttributes<HTMLDivElement> {
    selected: boolean;
}

/// A title of a panel, or a tab when it has an onClick; the selected one has the accent underline
export const PanelTitle = ({selected, ...rest}: PanelTitleProps) => (
    <div className={title_class(selected, rest.onClick !== undefined)} data-title="" {...rest}/>
);
