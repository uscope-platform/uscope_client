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


import {styled} from "goober";
import {CardTitle} from "./CardTitle.jsx";
import {Switch} from "../Switch.jsx";
import {ColorTheme} from "../ColorTheme.js";
import type {CSSProperties, ReactNode} from "react";



interface CardContainerProps {}
export const CardContainer = styled('div')<CardContainerProps>`
    display: flex;
    flex-direction: column;  
    border-color: ${() => ColorTheme.background.borders};
    background-color: ${() => ColorTheme.background.level_3};
    border-width: 2px;
    padding-left: 0.3em;
    border-style: solid;
`

interface CardProps {
    selector?: {
        name: string,
        label: string,
        value: boolean,
        click: (value: {name: string, checked: boolean}) => void;
    }
    // the title is left out when there is no name, no selector and nothing to remove
    name?: string | undefined,
    onRemove?: (() => void) | undefined,
    // shown at the right of the title
    actions?: ReactNode,
    children?: ReactNode;
    style?: CSSProperties;
}

export let Card = function (props: CardProps) {
    let selector_item = props.selector ? <Switch name={props.selector.name} onClick={props.selector.click} value={props.selector.value} label={props.selector.label} style={{marginLeft: "auto", marginRight: "0.5rem"}}/> :null
    let title_items = (selector_item || props.actions) ? <>{selector_item}{props.actions}</> : null
    return(
        <CardContainer style={props.style}>
            {(props.name !== undefined || props.selector || props.actions || props.onRemove) &&
                <CardTitle name={props.name} onRemove={props.onRemove} additionalItems={title_items}/>}
            {props.children}
        </CardContainer>
    );
};