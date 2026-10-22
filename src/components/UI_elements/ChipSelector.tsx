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

import React, {useEffect, useState} from "react";
import {styled} from "goober";
import {MdCheck} from "react-icons/md";
import {ColorTheme} from "./ColorTheme.js";

interface ToggleTileProps {
    checked: boolean;
    disabled: boolean;
}

// a tile of a set of choices: outlined, and tinted in the color of the accent when it is selected
const ToggleTile = styled<'div', ToggleTileProps>('div')(({checked, disabled}) => `
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
  padding: 0.45em 0.8em;
  border-radius: 0.5rem;
  min-width: 0;
  user-select: none;
  color: ${ColorTheme.text};
  border: 1px solid ${checked ? ColorTheme.background.accents : ColorTheme.background.borders};
  background: ${checked ? `color-mix(in srgb, ${ColorTheme.background.accents} 18%, transparent)` : ColorTheme.background.level_3};
  opacity: ${disabled ? 0.4 : 1};
  cursor: ${disabled ? "not-allowed" : "pointer"};
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    ${disabled ? "" : `background: ${checked ? `color-mix(in srgb, ${ColorTheme.background.accents} 28%, transparent)` : ColorTheme.background.level_4};`}
  }
`);

interface ChipSelectorProps {
    value: boolean;
    label: string;
    name: string;
    onClick: (value: {name: string, checked: boolean}) => void;
    // a chip that cannot be toggled (dimmed)
    disabled?: boolean;
    style?: React.CSSProperties;
    // the pill of a title (default), or a tile of a set of choices
    variant?: 'pill' | 'tile';
}

export let  ChipSelector = (props: ChipSelectorProps ) =>{

    let [checked, set_checked] = useState(props.value);

    // follows the value of the owner, which can change without a click (another item is selected, an edit is refused)
    useEffect(() => set_checked(props.value), [props.value]);

    let handle_click = () =>{
        if(props.disabled) return;
        let new_state = !checked;
        set_checked(new_state);
        props.onClick({name:props.name, checked:new_state});
    };

    if(props.variant === "tile"){
        return(
            <ToggleTile checked={checked} disabled={!!props.disabled} onClick={handle_click} style={props.style} title={props.label}>
                <span style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0}}>{props.label}</span>
                <MdCheck size="1.1em" color={ColorTheme.background.accents} style={{opacity: checked ? 1 : 0, flexShrink: 0}}/>
            </ToggleTile>
        );
    }

    let color = checked?ColorTheme.background.accents:ColorTheme.background.level_3;
    return(
        <div style={{
            marginLeft:"auto",
            paddingLeft:"0.3em",
            paddingRight:"0.3em",
            alignContent:"baseline",
            borderStyle:"solid",
            borderColor:color,
            backgroundColor:color,
            borderRadius:"30px",
            color: checked ? "black" : ColorTheme.text,
            opacity: props.disabled ? 0.4 : 1,
            cursor: props.disabled ? "not-allowed" : "pointer",
            ...props.style}
        } onClick={handle_click}
        >
            <p style={{cursor:"inherit"}}>{props.label}</p>
        </div>
    );
};
