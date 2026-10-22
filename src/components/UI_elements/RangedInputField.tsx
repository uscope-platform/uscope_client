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

import React, {useEffect, useState} from 'react';
import {styled} from 'goober';
import {Label} from "./Label.js";
import {ColorTheme} from "./ColorTheme.js";
import Select from "react-select";
import {useFieldFeedback} from "./useFieldFeedback.js";

import type {HTMLAttributes} from "react";

interface InnerInputProps {
    color:string
}


export const InnerInput = styled<'input', InnerInputProps>('input')(({ color }) => `
  height: 2rem;
  border-radius: 5px;
  border-width: 2px;
  border-style: solid;
  margin-top: 0.25em;
  width: auto;
  background-color: ${color};
  border-color: ${ColorTheme.background.borders};
  color: ${ColorTheme.text};
  transition: border-color 0.2s;
  &[data-status="dirty"], &[data-status="saving"] { border-color: ${ColorTheme.field.dirty}; }
  &[data-status="applied"] { border-color: ${ColorTheme.field.applied}; }
  &[data-status="error"] { border-color: ${ColorTheme.field.error}; }
  &[data-status="saving"] { opacity: 0.7; }
`);


interface InnerInputProps extends HTMLAttributes<HTMLDivElement>{}


const Wrapper = styled('div')`
margin: 0 0.2rem;
display: grid;
grid-template-columns: minmax(0, 1fr) auto;
gap: 0.25em 0.5em;
align-items: center;
`

interface RangedInputFieldProps {
    id: string;
    name: string;
    label: string;
    rangeOptions: string[];
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void | Promise<unknown>;
    onRangeChange: (value: string) => void;
    value: any;
    range: string;

}

export let  RangedInputField = (props: RangedInputFieldProps) =>{
    let [range, set_range] = useState({label: "", value: "0"});
    const feedback = useFieldFeedback(props.value, props.onKeyDown, true);
    const color= ColorTheme.background.select_background ;

    const SelectStyle = {
        control:(provided: any,  { data, isDisabled, isFocused, isSelected }: any) => ({
            ...provided,
            minWidth:"7em",
            backgroundColor: color,
        }),

        menu: (provided: any,  { data, isDisabled, isFocused, isSelected }: any) => ({
            ...provided,
            width: "max-content",
            backgroundColor: color
        }),

        menuPortal: (provided: any,  { data, isDisabled, isFocused, isSelected }: any) => ({
            ...provided,
        }),

        option: (provided: any,  { data, isDisabled, isFocused, isSelected }: any) => ({
            ...provided,
            backgroundColor: isFocused?ColorTheme.background.transparent_accents:undefined
        }),

        singleValue:(provided: any,  { data, isDisabled, isFocused, isSelected }: any) => ({
            ...provided,
            color: ColorTheme.text
        })
    };

    useEffect(()=>{
        set_range({label: props.range, value: props.range})
    }, [props.range])


    const options = props.rangeOptions.map((val)=>{
        return {label: val, value: val};
    })

    const handle_range_change = (value: any)=>{
        props.onRangeChange(value.value);
    }

    return (
        <Wrapper>
            <Label htmlFor={props.id} style={{gridColumn: "1 / -1"}}>{props.label}</Label>
            <InnerInput
                name={props.name}
                key={props.value}
                color={ColorTheme.background.level_3}
                id={props.id}
                data-status={feedback.status}
                title={feedback.title}
                onInput={feedback.on_input}
                onKeyDown={feedback.key_down}
                defaultValue={props.value}
            />
            <Select
                styles={SelectStyle}
                menuPortalTarget={document.body}
                onChange={handle_range_change}
                options={options}
                value={range}
            />
        </Wrapper>
    );
};
