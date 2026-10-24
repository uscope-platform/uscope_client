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


import React from 'react';
import {styled} from "goober";
import {ColorTheme} from "./ColorTheme.js";

const Group = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`

// the radio is what is focused and checked, hidden under the label that is drawn as a button
const Option = styled('label')`
  position: relative;
  min-width: 2.4rem;
  padding: 0.3rem 0.7rem;
  border-radius: 5px;
  border: 2px solid ${ColorTheme.background.borders};
  background: ${ColorTheme.background.level_3};
  text-align: center;
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover {
    border-color: ${ColorTheme.background.accents};
  }
  &:has(input:checked) {
    border-color: ${ColorTheme.background.accents};
    background: ${ColorTheme.background.transparent_accents};
  }
  &:has(input:disabled) {
    opacity: 0.4;
    cursor: not-allowed;
    border-color: ${ColorTheme.background.borders};
  }
  &:has(input:focus-visible) {
    outline: 2px solid ${ColorTheme.background.accents};
    outline-offset: 1px;
  }
  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
`

// the options joined in one piece, with no space or line between them: the one that is chosen is the one tinted
const SegmentedGroup = styled('div')`
  display: inline-flex;
  flex-wrap: nowrap;
  max-width: 100%;
  overflow: hidden;
  border-radius: 5px;
  border: 2px solid ${ColorTheme.background.borders};
  background: ${ColorTheme.background.level_3};
`

const SegmentedOption = styled('label')`
  position: relative;
  padding: 0.3rem 0.9rem;
  font-size: 0.85rem;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: ${ColorTheme.background.level_5};
  }
  &:has(input:checked) {
    font-weight: 600;
    background: ${ColorTheme.background.transparent_accents};
  }
  &:has(input:disabled) {
    opacity: 0.4;
    cursor: not-allowed;
    background: transparent;
  }
  &:has(input:focus-visible) {
    outline: 2px solid ${ColorTheme.background.accents};
    outline-offset: -2px;
  }
  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
`

export interface RadioOption {
    label: string;
    value: string;
    /// the option cannot be chosen, and the reason is its tooltip
    disabled?: string | undefined;
}

interface RadioGroupProps {
    name: string;
    label: string;
    options: RadioOption[];
    value: string;
    onChange: (value: string) => void;
    /// separate buttons (the default), or the options joined in one piece
    variant?: "buttons" | "segmented";
}

/// A choice of one among a few options
export let RadioGroup = (props: RadioGroupProps) => {
    const joined = props.variant === "segmented";
    const Group_ = joined ? SegmentedGroup : Group;
    const Option_ = joined ? SegmentedOption : Option;
    return (
        <Group_ role="radiogroup" aria-label={props.label}>
            {props.options.map((option) => (
                <Option_ key={option.value} title={option.disabled}>
                    <input
                        type="radio"
                        disabled={option.disabled !== undefined}
                        name={props.name}
                        value={option.value}
                        checked={option.value === props.value}
                        onChange={() => props.onChange(option.value)}
                    />
                    {option.label}
                </Option_>
            ))}
        </Group_>
    );
};
