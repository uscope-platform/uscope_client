// Copyright 2024 Filippo Savi
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
import {MdPlayArrow, MdSkipNext, MdWrapText} from "react-icons/md";
import {ColorTheme, RadioGroup} from "#UI/index.js";
import type {DebuggerCheckpoint} from "#interfaces/index.js";

const Bar = styled('div')`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem 1.5rem;
  padding: 0.6rem 0.8rem;
`

const Group = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Status = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 14rem;
  font-size: 0.85rem;
`

const Progress = styled('progress')`
  width: 100%;
  height: 0.4rem;
  accent-color: ${ColorTheme.background.accents};
`

const ToolButton = styled<'button', {primary?: boolean}>('button')(({primary}) => `
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.8rem 0.35rem 0.5rem;
  border-radius: 5px;
  border: 2px solid ${primary ? ColorTheme.background.accents : ColorTheme.background.borders};
  background: ${primary ? ColorTheme.background.accents : ColorTheme.background.level_3};
  color: ${primary ? "black" : ColorTheme.text};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    border-color: ${ColorTheme.background.accents};
  }
`)

interface DebuggerToolbarProps {
    run: () => void,
    step: () => void,
    resume: () => void,
    vis_type: string,
    on_vis_type: (type: string) => void,
    checkpoint: DebuggerCheckpoint,
}

let DebuggerToolbar = (props: DebuggerToolbarProps) => {
    const {checkpoint} = props;
    const started = checkpoint.status !== "";
    const progress = checkpoint.progress.total_steps > 0 ? checkpoint.progress.current / checkpoint.progress.total_steps : 0;

    return (
        <Bar>
            <Group>
                <ToolButton primary title="Start the emulation, it stops at the first breakpoint" onClick={props.run}>
                    <MdPlayArrow size="1.4em"/>Run
                </ToolButton>
                <ToolButton title="Execute the next instruction of the selected program" onClick={props.step}>
                    <MdWrapText size="1.4em"/>Step
                </ToolButton>
                <ToolButton title="Continue until the next breakpoint" onClick={props.resume}>
                    <MdSkipNext size="1.4em"/>Resume
                </ToolButton>
            </Group>
            <Status>
                <span>
                    {started
                        ? <>Paused in <b>{checkpoint.core_name}</b> at line <b>{checkpoint.breakpoint + 1}</b></>
                        : "Not started, press Run"}
                </span>
                {started && (
                    <>
                        <Progress value={progress} max={1}/>
                        <span style={{opacity: 0.6}}>Step {checkpoint.progress.current} of {checkpoint.progress.total_steps}</span>
                    </>
                )}
            </Status>
            <Group>
                <span style={{fontSize: "0.85rem", opacity: 0.6}}>Show words as</span>
                <RadioGroup
                    name="word_format"
                    label="Show words as"
                    options={[{label: "Float", value: "float"}, {label: "Integer", value: "int"}]}
                    value={props.vis_type}
                    onChange={props.on_vis_type}
                />
            </Group>
        </Bar>
    );
};

export default DebuggerToolbar;
