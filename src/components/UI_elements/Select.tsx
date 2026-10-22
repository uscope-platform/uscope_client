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

import {styled} from 'goober';
import {Label} from "./Label.js";
import React, {type JSX} from "react";
import Select, {type ActionMeta} from "react-select";
import {ColorTheme} from "./ColorTheme.js";
import type {DefaultOption} from "#interfaces/index.js";

interface SelectWrapperProps {
    stacked?: boolean | undefined;
}

// goober hands every prop to the element, `stacked` is only for the style
const SelectWrapperBase = ({stacked, ...rest}: SelectWrapperProps & React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest}/>
);

const SelectWrapper = styled<SelectWrapperProps & React.HTMLAttributes<HTMLDivElement>>(SelectWrapperBase)(({stacked}) => `
    display: grid;
    grid-template-columns: ${stacked ? "1fr" : "repeat(2, auto)"};
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`)


interface SelectFieldProps<Option extends DefaultOption=DefaultOption> {
    onChange: (value: Option | null, event: ActionMeta<Option>) => void;
    name: string;
    label?: string;
    stacked?: boolean;
    style?: React.CSSProperties;
    defaultValue?: Option;
    placeholder?: Option;
    value?: Option | null;
    options: readonly Option[];
}


export let  SelectField = <Option extends DefaultOption = DefaultOption>(
    props: SelectFieldProps<Option>
): JSX.Element => {


    const style = {
            control:(provided: any,  { data, isDisabled, isFocused, isSelected }: any) => ({
                ...provided,
                minWidth:"7em",
                backgroundColor: ColorTheme.background.select_background,
            }),

            menu: (provided: any,  { data, isDisabled, isFocused, isSelected }: any) => ({
                ...provided,
                width: "max-content",
                backgroundColor: ColorTheme.background.select_background
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

    const onSelectChange = (value: any, event: ActionMeta<any>) => props.onChange(value, event);
    // Only control the select when a value prop is supplied, otherwise it can never change selection
    const controlled_props = props.value !== undefined ? {value: props.value} : {};

    return(
        <SelectWrapper stacked={props.stacked}>
            <Label htmlFor={props.name} >{props.label}</Label>
            <Select
                name={props.name}
                id={props.name}
                styles={style}
                defaultValue={props.defaultValue}
                {...controlled_props}
                menuPortalTarget={document.body}
                onChange={onSelectChange}
                options={props.options}
            />
        </SelectWrapper>
    );
};

