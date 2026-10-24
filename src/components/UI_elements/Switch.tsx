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
import {ColorTheme} from "./ColorTheme.js";

interface TrackProps {
    checked: boolean;
}

const Track = styled<'span', TrackProps>('span')(({checked}) => `
  position: relative;
  flex: 0 0 auto;
  width: 2.2rem;
  height: 1.2rem;
  border-radius: 1rem;
  border: 1px solid ${checked ? ColorTheme.background.accents : ColorTheme.background.bordersLight};
  background: ${checked ? ColorTheme.background.accents : ColorTheme.background.level_4};
  transition: background 0.15s, border-color 0.15s;
`);

const Thumb = styled<'span', TrackProps>('span')(({checked}) => `
  position: absolute;
  top: 50%;
  left: 0.15rem;
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  transform: translate(${checked ? "1rem" : "0"}, -50%);
  background: ${checked ? "black" : ColorTheme.text};
  transition: transform 0.15s;
`);

const Wrapper = styled('button')`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: ${ColorTheme.text};
`;

interface SwitchProps {
    value: boolean;
    label: string;
    name: string;
    onClick: (value: {name: string, checked: boolean}) => void;
    style?: React.CSSProperties | undefined;
}

/// An on/off setting, with its label
export let Switch = (props: SwitchProps) =>{

    let [checked, set_checked] = useState(props.value);

    // follows the value of the owner, which can change without a click (another item is selected)
    useEffect(() => set_checked(props.value), [props.value]);

    let handle_click = () =>{
        let new_state = !checked;
        set_checked(new_state);
        props.onClick({name: props.name, checked: new_state});
    };

    return(
        <Wrapper type="button" role="switch" aria-checked={checked} onClick={handle_click} style={props.style}>
            {props.label}
            <Track checked={checked}><Thumb checked={checked}/></Track>
        </Wrapper>
    );
};
