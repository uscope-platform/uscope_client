// Copyright 2021 University of Nottingham Ningbo China
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

import React, {useId} from "react";
import type {ReactNode} from "react";
import {styled} from "goober";
import {ColorTheme} from "./ColorTheme.js";
import {Tooltip} from "./Tooltip.js";

/// The row of actions on top of an editor
export const Toolbar = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.1em;
  padding: 0.1em 0.4em;
`

export const ToolbarSeparator = styled('div')`
  width: 1px;
  align-self: stretch;
  margin: 0.15em 0.2em;
  background: ${ColorTheme.background.bordersLight};
`

const Button = styled('button')`
  display: flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.25em 0.55em;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${ColorTheme.text};
  font: inherit;
  font-size: 0.85em;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${ColorTheme.background.level_5};
  }
  &:disabled {
    color: ${ColorTheme.disabled_icon_color};
    cursor: default;
  }
`

interface ToolbarButtonProps {
    label: string;
    /// what the tooltip tells, when it is more than the label
    tooltip?: string;
    icon: ReactNode;
    enabled?: boolean;
    onClick: () => void;
}

/// An action of a toolbar: an icon with a short label, and a tooltip
export const ToolbarButton = (props: ToolbarButtonProps) => {
    // the same editor can be open more than once, so the anchor cannot be a fixed id
    const id = "toolbar_" + useId().replace(/:/g, "");
    return (
        <Button id={id} disabled={props.enabled === false} onClick={props.onClick}>
            {props.icon}
            {props.label}
            <Tooltip anchorSelect={"#" + id} content={props.tooltip ?? props.label} place="bottom"/>
        </Button>
    );
};
