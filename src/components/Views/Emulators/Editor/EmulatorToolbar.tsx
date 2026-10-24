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

import {ColorTheme} from "#UI/index.js";
import {Tooltip} from "#UI/Tooltip.js";
import {
    MdCode,
    MdMemory,
    MdPlayArrow,
    MdRocketLaunch
} from "react-icons/md";

const Bar = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.1em;
  padding: 0.1em 0.4em;
`

const Separator = styled('div')`
  width: 1px;
  align-self: stretch;
  margin: 0.15em 0.2em;
  background: ${ColorTheme.background.bordersLight};
`

const ToolButton = styled('button')`
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

interface EmulatorToolbarProps {
    onEdit: () => void;
    onRun: () => void;
    onDeploy: () => void;
    onHardwareSim: () => void;
    enable: {
        edit: boolean,
        run: boolean,
        hw_sim: boolean,
        deploy: boolean,
    }
}

let  EmulatorToolbar = (props: EmulatorToolbarProps) =>{

    const button = (id: string, label: string, tooltip: string, icon: React.ReactNode, enabled: boolean, onClick: () => void) => (
        <ToolButton key={id} id={"toolbar_" + id} disabled={!enabled} onClick={onClick}>
            {icon}
            {label}
            <Tooltip anchorSelect={"#toolbar_" + id} content={tooltip} place="bottom"/>
        </ToolButton>
    );

    return (
        <Bar>
            {button("run", "Run", "Run the emulation", <MdPlayArrow size="1.5em"/>, props.enable.run, props.onRun)}
            <Separator/>
            {button("edit", "Program", "Edit Program", <MdCode size="1.5em"/>, props.enable.edit, props.onEdit)}
            {button("deploy", "Deploy", "Deploy", <MdRocketLaunch size="1.5em"/>, props.enable.deploy, props.onDeploy)}
            {button("hw_sim", "HW sim", "Download HW simulation files", <MdMemory size="1.5em"/>, props.enable.hw_sim, props.onHardwareSim)}
        </Bar>
    );
};

export default EmulatorToolbar;
