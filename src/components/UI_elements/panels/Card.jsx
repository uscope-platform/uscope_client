// Copyright 2021 Filippo Savi
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


import styled from "styled-components";
import {CardTitle} from "./CardTitle";
import {ChipSelector} from "../ChipSelector";

export const CardContainer = styled.div`
    display: flex;
    flex-direction: column;  
    border-color: ${props => props.theme.background.borders};
    background-color: ${props => props.theme.background.level_3};
    border-width: 2px;
    padding-left: 0.3em;
    border-style: solid;
`

export let Card = function (props) {
    let title_items = props.selector ? <ChipSelector name={props.selector.name} onClick={props.selector.click} value={props.selector.value} label={props.selector.label}/> :null
    return(
        <CardContainer>
            <CardTitle name={props.name} onRemove={props.onRemove} additionalItems={title_items}/>
            {props.children}
        </CardContainer>
    );
};