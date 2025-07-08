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
import styled from 'styled-components';
import {Label} from "./Label";
import {ColorTheme} from "./ColorTheme";

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
grid-template-columns:  ${props => props.inline ? "1fr 1fr" : "1fr"};
grid-auto-rows: auto;
justify-content: ${props => props.inline ? "space-between" : "start"};
align-items: center;
flex-flow: wrap;
`



export let  InputField = props =>{
    let key = props.name;
    if(props.defaultValue) key += props.defaultValue;

    if(props.compact){
        return (
            <InnerInput
                id={props.id}
                name={props.name}
                key={key}
                type={(props.type)?props.type:"text"}
                placeholder={props.label}
                color={props.color ? props.color : ColorTheme.background.level_3}
                disabled = {(props.disabled)? "disabled" : ""}
                onChange={e => {if(props.onChange) props.onChange(e)}}
                onKeyDown={e => {if(props.onKeyDown) props.onKeyDown(e)}}
                defaultValue={props.defaultValue}
                value={props.value?props.value:undefined}
            />
        );
    } else if(props.description){
        return (
            <Wrapper>
                <Label htmlFor={props.ID} inline={props.inline.toString()}>{props.label}</Label>
                <InnerInput
                    name={props.name}
                    key={key}
                    placeholder={props.placeholder}
                    id={props.ID}
                    color={props.color ? props.color : ColorTheme.background.level_3}
                    type={(props.type)?props.type:"text"}
                    disabled = {(props.disabled)? "disabled" : ""}
                    onChange={e => {if(props.onChange) props.onChange(e)}}
                    onKeyDown={e => {if(props.onKeyDown) props.onKeyDown(e)}}
                    defaultValue={props.defaultValue}
                    value={props.value?props.value:undefined}
                />
                <InputDescription>{props.description}</InputDescription>
            </Wrapper>
        );
    } else{
        return (
            <Wrapper inline={props.inline.toString()}>
                <Label htmlFor={props.ID} inline={props.inline.toString()}>{props.label}</Label>
                <InnerInput
                    placeholder={props.placeholder}
                    name={props.name}
                    key={key}
                    color={props.color ? props.color : ColorTheme.background.level_3}
                    id={props.ID}
                    type={(props.type)?props.type:"text"}
                    disabled = {(props.disabled)? "disabled" : ""}
                    onChange={e => {if(props.onChange) props.onChange(e)}}
                    onKeyDown={e => {if(props.onKeyDown) props.onKeyDown(e)}}
                    defaultValue={props.defaultValue}
                    value={props.value?props.value:undefined}
                />
            </Wrapper>
        );
    }

};
