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

import styled from 'styled-components';
import {Label} from "./Label";
import React from "react";
import Select from "react-select";
import {ColorTheme} from "./ColorTheme";


const SelectWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`


export let  SelectField = props =>{

    const color= props.color ? props.color : ColorTheme.background.select_background ;

    const Style = {
        control:(provided,  { data, isDisabled, isFocused, isSelected }) => ({
            ...provided,
            backgroundColor: color,
        }),

        menu: (provided,  { data, isDisabled, isFocused, isSelected }) => ({
            ...provided,
            backgroundColor: color,
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

    return(
        <SelectWrapper>
            <Label htmlFor={props.name} >{props.label}</Label>
            <Select
                name={props.name}
                id={props.name}
                styles={Style}
                defaultValue={props.defaultValue}
                value={props.value ? props.value: undefined}
                menuPortalTarget={document.body}
                onChange={props.onChange}
                color={props.color ? props.color : ColorTheme.background.level_3}
                options={props.options}
            />
        </SelectWrapper>
    );
};
