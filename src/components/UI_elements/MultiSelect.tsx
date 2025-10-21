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

import ReactSelect, {type ActionMeta, type MultiValue} from 'react-select';
import React, {type JSX} from 'react';
import {ColorTheme} from "./ColorTheme.js";
import {styled} from "goober";
import {Label} from "./Label.js";


interface WrapperProps {
    inline?: boolean;
}

const  Wrapper = styled('div')<WrapperProps>`
margin: 0 0.2rem;
display: grid;
grid-template-columns: 1fr;
grid-auto-rows: auto;
justify-content:start;
align-items: center;
flex-flow: wrap;
`
interface DefaultOption {
    label: string;
    value: string;
}

interface MultiSelectProps<Option extends DefaultOption=DefaultOption> {
    id: string;
    name?: string;
    label: string;
    value: any;
    onChange: (newValue:MultiValue<Option>, action: ActionMeta<Option> ) => void;
    options: any;
    color?: string;
    inline: boolean;
}



export let  MultiSelect = <Option extends DefaultOption = DefaultOption>(
    props: MultiSelectProps<Option>
): JSX.Element =>{

        const color= props.color ? props.color : ColorTheme.background.select_background ;

        const Style = {
            control:(provided: any,  { data, isDisabled, isFocused, isSelected }: any) => ({
                ...provided,
                backgroundColor: color,
            }),

            menu: (provided: any,  { data, isDisabled, isFocused, isSelected }: any) => ({
                ...provided,
                backgroundColor: color,
            }),

            menuPortal: (provided: any,  { data, isDisabled, isFocused, isSelected }: any) => ({
                ...provided,
                backgroundColor: color,
            }),

            option: (provided: any,  { data, isDisabled, isFocused, isSelected }: any) => ({
                ...provided,
                backgroundColor: isFocused?ColorTheme.background.transparent_accents:undefined
            }),

            multiValue: (provided: any,  { data }: any) => ({
                ...provided,
                backgroundColor: "#0000",
                borderColor:ColorTheme.background.borders,
                borderWidth:"2px",
                borderStyle:"solid"
            }),

            multiValueLabel: (styles: any, { data }: any) => ({
                ...styles,
                color: data.color
            }),
            multiValueRemove: (styles: any, { data }: any) => ({
                ...styles,
                color: data.color,
                ':hover': {
                    backgroundColor: data.color,
                    color: 'red',
                },
            }),

        };

        return (
            <Wrapper inline={props.inline}>
                    <Label htmlFor={props.id}>{props.label}</Label>
                    <ReactSelect
                        name={props.id}
                        isMulti={true}
                        styles={Style}
                        options={props.options}
                        menuPortalTarget={document.body}
                        value={props.value}
                        onChange={(newValue:MultiValue<Option>, action: ActionMeta<Option> ) => {if(props.onChange) props.onChange(newValue, action)}}
                    />
            </Wrapper>

        );
};
