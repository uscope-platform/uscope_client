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
import React, {type JSX, useCallback, useMemo} from "react";
import Select, {type ActionMeta} from "react-select";
import {ColorTheme} from "./ColorTheme.js";
import type {DefaultOption} from "#interfaces/index.js";

const SelectWrapper = styled('div')`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`


interface SelectFieldProps<Option extends DefaultOption=DefaultOption> {
    onChange: (value: Option | null, event: ActionMeta<Option>) => void;
    name: string;
    label?: string;
    style?: React.CSSProperties;
    defaultValue?: Option;
    placeholder?: Option;
    value?: Option | null;
    options: readonly Option[];
}


export let  SelectField = <Option extends DefaultOption = DefaultOption>(
    props: SelectFieldProps<Option>
): JSX.Element => {


    const style = useMemo(()=>{
        return {
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
    }, [ColorTheme])

    const onSelectChange = useCallback((value: any, event: ActionMeta<any>) => props.onChange(value, event), [props.onChange]);
    let selected_value = props.value ? props.value: null
    selected_value = selected_value ? selected_value : null;

    return(
        <SelectWrapper>
            <Label htmlFor={props.name} >{props.label}</Label>
            <Select
                name={props.name}
                id={props.name}
                styles={style}
                defaultValue={props.defaultValue}
                value={selected_value}
                menuPortalTarget={document.body}
                onChange={onSelectChange}
                options={props.options}
            />
        </SelectWrapper>
    );
};

