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

const InputCheckbox = styled.input`
border-width: 0;
`

const Wrapper = styled.div`
    
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
    grid-auto-rows: auto; 
    flex-flow: wrap;
`
export let  Radio = props =>{

    let render_options = () =>{
        let ret = [];
        for(let v of props.options) {
            ret.push(
                <label key={props.label + "_radio_" + v}>
                    <input type="radio" name={props.label + "_radio"} value={v} checked={props.value === v}/>
                    {v}
                </label>
            )
        }
        return ret;
    }

    let handle_change = (event) => {
        if(props.onChange){
            props.onChange(event.target.value);
        }

    }

    return (
        <Wrapper>
            <Label htmlFor={props.name} inline={props.inline}>{props.label}</Label>
            <div style={{
                marginLeft:"auto",
                marginRight:"0.2em",
                display:"flex",
                gap: "1em"
             }} onChange={handle_change}>
                {render_options()}
            </div>
        </Wrapper>
    );
};