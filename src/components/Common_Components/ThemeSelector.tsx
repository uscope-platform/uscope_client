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
import {MdLightMode, MdDarkMode, MdSettingsBrightness} from "react-icons/md";

import {ColorTheme} from "#UI/index.js";
import {themePreference, setTheme, type ThemePreference} from "#UI/themes.js";


const Group = styled('div')`
  display: inline-flex;
  border: 1px solid ${ColorTheme.background.borders};
  border-radius: 0.5rem;
  overflow: hidden;
`

interface OptionProps {
    selected: boolean;
}

const Option = styled<'button', OptionProps>('button')(({selected}) => `
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  color: ${selected ? "black" : ColorTheme.text};
  background: ${selected ? ColorTheme.background.accents : ColorTheme.background.level_3};
  &:hover {
    background: ${selected ? ColorTheme.background.accents : ColorTheme.background.level_4};
  }
  & + & {
    border-left: 1px solid ${ColorTheme.background.borders};
  }
`)

const OPTIONS: {value: ThemePreference, label: string, icon: React.ReactNode}[] = [
    {value: "system", label: "System", icon: <MdSettingsBrightness size="1.3em"/>},
    {value: "light", label: "Light", icon: <MdLightMode size="1.3em"/>},
    {value: "dark", label: "Dark", icon: <MdDarkMode size="1.3em"/>},
];

/// Picks the theme of the interface, the page reloads to apply it
let ThemeSelector = () =>{
    return(
        <Group role="radiogroup" aria-label="Theme">
            {OPTIONS.map(o => (
                <Option key={o.value}
                        role="radio"
                        aria-checked={o.value === themePreference}
                        selected={o.value === themePreference}
                        onClick={() => {if(o.value !== themePreference) setTheme(o.value)}}>
                    {o.icon}{o.label}
                </Option>
            ))}
        </Group>
    );
};

export default ThemeSelector;
