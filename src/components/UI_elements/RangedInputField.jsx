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
import styled from 'styled-components';
import {Label} from "./Label";
import {ColorTheme} from "./ColorTheme";
import Select from "react-select";

const InnerInput = styled.input`
  height: 2rem;
  border-radius: 5px;
  border-width: 2px;
  border-style: solid;
  margin-top: 0.25em;
  width: auto;
  background-color: ${props => props.color};
  border-color: ${props => props.theme.background.border};
  color: ${props => props.theme.text};
`

const InputDescription = styled.label`
width: fit-content;
font-family: Roboto,Helvetica,Arial,sans-serif;
font-size: 0.7rem;
margin-top: 0.15rem;
margin-left: 0.15rem;
`

const Wrapper = styled.div`
margin: 0 0.2rem;
display: grid;
grid-template-columns: 1fr 0.8fr 0.8fr;
grid-auto-rows: auto;
justify-content: space-between;
align-items: center;
flex-flow: wrap;
`


export let  RangedInputField = props =>{
    let [range, set_range] = useState({label:props.defaultRange, value:props.defaultRange});
    const color= props.color ? props.color : ColorTheme.background.select_background ;

    const SelectStyle = {
        control:(provided,  { data, isDisabled, isFocused, isSelected }) => ({
            ...provided,
            minWidth:"7em",
            backgroundColor: color,
        }),

        menu: (provided,  { data, isDisabled, isFocused, isSelected }) => ({
            ...provided,
            width: "max-content",
            backgroundColor: color
        }),

        menuPortal: (provided,  { data, isDisabled, isFocused, isSelected }) => ({
            ...provided,
        }),

        option: (provided,  { data, isDisabled, isFocused, isSelected }) => ({
            ...provided,
            backgroundColor: isFocused?ColorTheme.background.transparent_accents:undefined
        }),

        singleValue:(provided,  { data, isDisabled, isFocused, isSelected }) => ({
            ...provided,
            color: ColorTheme.text
        })
    };


    const options = props.rangeOptions.map((val)=>{
        return {label: val, value: val};
    })

    const handle_range_change = (value)=>{
        props.onRangeChange(value.value);
    }

    return (
        <Wrapper inline={props.inline}>
            <Label htmlFor={props.ID} inline={props.inline}>{props.label}</Label>
            <InnerInput
                placeholder={props.placeholder}
                name={props.name}
                key={props.key}
                color={props.color ? props.color : ColorTheme.background.level_3}
                id={props.ID}
                type={(props.type)?props.type:"text"}
                disabled = {(props.disabled)? "disabled" : ""}
                onChange={e => {if(props.onChange) props.onChange(e)}}
                onKeyDown={e => {if(props.onKeyDown) props.onKeyDown(e)}}
                defaultValue={props.defaultValue}
                value={props.value?props.value:undefined}
            />
            <Select
                styles={SelectStyle}
                defaultValue={range}
                menuPortalTarget={document.body}
                onChange={handle_range_change}
                color={props.color ? props.color : ColorTheme.background.level_3}
                options={options}
            />
        </Wrapper>
    );
};
