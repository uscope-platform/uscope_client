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

import ReactSelect from 'react-select';
import React from 'react';
import {ColorTheme} from "./ColorTheme";
import styled from "styled-components";
import {Label} from "./Label";



const Wrapper = styled.div`
margin: 0 0.2rem;
display: grid;
grid-template-columns: 1fr;
grid-auto-rows: auto;
justify-content:start;
align-items: center;
flex-flow: wrap;
`



export let  MultiSelect = props =>{

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
            })
        };

        return (
            <Wrapper inline={props.inline}>
                    <Label htmlFor={props.ID} inline={props.inline}>{props.label}</Label>
                    <ReactSelect
                        name={props.ID}
                        isMulti={true}
                        styles={Style}
                        options={props.options}
                        menuPortalTarget={document.body}
                        value={props.value}
                        onChange={e => {if(props.onChange) props.onChange(e)}}
                    />
            </Wrapper>

        );
};
