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
import React from "react";

import {Label} from "./Label";

const InputRadio = styled.input`
height: 1rem;
`

const Wrapper = styled.div`
 display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
`


export let  Radio = props =>{

    return(
        <Wrapper>
            <InputRadio
                name={props.name}
                id={props.id}
                type="radio"
                checked = {props.value}
                onChange={e => props.onChange(e)}/>
            <Label inline={props.inline}>{props.label}</Label>
        </Wrapper>
    );
};
