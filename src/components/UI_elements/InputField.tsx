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

import React from 'react';
import {styled} from 'goober';
import {Label} from "./Label.js";
import {ColorTheme} from "./ColorTheme.js";
import {useFieldFeedback} from "./useFieldFeedback.js";

interface InnerInputProps {
    color:string
}

export const InnerInput = styled<'input', InnerInputProps>('input')(({ color }) => `
  height: 2rem;
  border-radius: 5px;
  border-width: 2px;
  border-style: solid;
  margin-top: 0.25em;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  background-color: ${color};
  border-color: ${ColorTheme.background.borders};
  color: ${ColorTheme.text};
  transition: border-color 0.2s;
  &[data-status="dirty"], &[data-status="saving"] { border-color: ${ColorTheme.field.dirty}; }
  &[data-status="applied"] { border-color: ${ColorTheme.field.applied}; }
  &[data-status="error"], &[data-invalid] { border-color: ${ColorTheme.field.error}; }
  &[data-status="saving"] { opacity: 0.7; }
`);



const InputDescription = styled('label')`
width: fit-content;
font-family: Roboto,Helvetica,Arial,sans-serif;
font-size: 0.7rem;
margin-top: 0.15rem;
margin-left: 0.15rem;
`

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    inline?: boolean | undefined;
    children?: React.ReactNode;
}

const WrapperBase = ({ inline, children, ...rest }: WrapperProps) => (
    <div {...rest}>{children}</div>
);

export const Wrapper = styled(WrapperBase)<WrapperProps>(({ inline }) => `
  margin: 0 0.2rem;
  display: grid;
  grid-template-columns: ${inline ? "minmax(0, 1fr) minmax(0, 1fr)" : "minmax(0, 1fr)"};
  grid-auto-rows: auto;
  justify-content: ${inline ? "space-between" : "start"};
  align-items: center;
  flex-flow: wrap;
`);



interface InputFieldProps {
    defaultValue?: string;
    name: string;
    compact?: boolean;
    inline?: boolean;
    description?:string;
    id?: string;
    type?:string;
    label?:string;
    color?: string;
    disabled?:boolean;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void | Promise<unknown>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?:string;
    placeholder?:string;
    /// why the value is implausible, when it is: the field gets a red border and the message as its title
    error?: string | undefined;
}


export let  InputField = (props: InputFieldProps) =>{
    let key = props.name;
    if(props.defaultValue)
        key += props.defaultValue;
    else if(props.value)
        key += props.value;
    // only a field that applies its edit on Enter has a pending edit to show: not a controlled one (it has a value of
    // its own) and not one that reports every change
    const feedback = useFieldFeedback(props.defaultValue, props.onKeyDown, props.value === undefined && props.onKeyDown !== undefined);
    const feedback_props = {
        "data-status": feedback.status,
        title: props.error ?? feedback.title,
        "data-invalid": props.error ? "" : undefined,
        onInput: feedback.on_input,
        onKeyDown: feedback.key_down,
    };
    if(props.compact){
        return (
            <InnerInput
                id={props.id}
                name={props.name}
                key={key}
                type={(props.type)?props.type:"text"}
                placeholder={props.label}
                color={props.color ? props.color : ColorTheme.background.level_3}
                disabled = {props.disabled}
                onChange={e => {if(props.onChange) props.onChange(e)}}
                {...feedback_props}
                defaultValue={props.defaultValue}
                value={props.value?props.value:undefined}
            />
        );
    } else if(props.description){
        return (
            <Wrapper key={key} inline={ props.inline}>
                <Label htmlFor={props.id}>{props.label}</Label>
                <InnerInput
                    name={props.name}
                    placeholder={props.placeholder}
                    id={props.id}
                    color={props.color ? props.color : ColorTheme.background.level_3}
                    type={(props.type)?props.type:"text"}
                    disabled = {props.disabled}
                    onChange={e => {if(props.onChange) props.onChange(e)}}
                    {...feedback_props}
                    defaultValue={props.defaultValue}
                    value={props.value?props.value:undefined}
                />
                <InputDescription>{props.description}</InputDescription>
            </Wrapper>
        );
    } else{
        return (
            <Wrapper key={key} inline={ props.inline}>
                <Label htmlFor={props.id}>{props.label}</Label>
                <InnerInput
                    placeholder={props.placeholder}
                    name={props.name}
                    color={props.color ? props.color : ColorTheme.background.level_3}
                    id={props.id}
                    type={(props.type)?props.type:"text"}
                    disabled = {props.disabled}
                    onChange={e => {if(props.onChange) props.onChange(e)}}
                    {...feedback_props}
                    defaultValue={props.defaultValue}
                    value={props.value?props.value:undefined}
                />
            </Wrapper>
        );
    }

};
