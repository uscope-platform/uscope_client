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



export const Select = styled.select`
  width: fit-content;
  height: 2rem;
  border-radius: 5px;
  min-width: 4em;
  option {
    display: flex;
    justify-content: center;
    min-height: 20px;
  }
`;


const SelectWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 0.3rem;
    justify-content: space-between;
    align-items: start;
`

export let  SelectField = props =>{
    return(
        <SelectWrapper>
            <Label>{props.label}</Label>
            <Select name={props.name} id={props.name} defaultValue={props.defaultValue} onChange={props.onChange}>
                <option value={props.name} hidden>{props.placeholder}</option>
                {
                    props.options.map((name,i) => (
                        <option key={i} >{name}</option>
                    ))
                }
            </Select>
        </SelectWrapper>
    );
};

