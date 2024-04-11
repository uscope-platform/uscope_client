// Copyright 2024 Filippo Savi
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
import Toggle from 'react-toggle'
import "react-toggle/style.css"

const Wrapper = styled.div`
    
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content: space-between;
    grid-auto-rows: auto; 
    flex-flow: wrap;
`
export let ToggleField = props =>{


    let handle_change = (event) => {
        if(props.onChange){
            props.onChange(event);
        }

    }

    return (
        <Wrapper>
            <Label htmlFor={props.name} inline={props.inline}>{props.label[0]}</Label>
            <Toggle
                id={props.name + '_id'}
                icons={false}
                checked={props.value}
                onChange={handle_change} />
            <Label inline={props.inline}>{props.label[1]}</Label>
        </Wrapper>
    );
};