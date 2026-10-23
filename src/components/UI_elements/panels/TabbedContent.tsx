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

import React from 'react';
import type {ReactNode} from 'react';
import {ContentDiv} from "./UIPanel.js";
import {PanelTitle, TitleBar} from "./TitleBar.js";

interface TabbedContentProps {
    names: string[];
    selected: number;
    onSelect: (index: number) => void;
    children: ReactNode;
}

export let TabbedContent = function (props: TabbedContentProps) {
    const childrenArray: ReactNode[] = React.Children.map(props.children, (child: ReactNode, index) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                key: child.key || `tab-content-${index}`
            });
        }
        return child;
    }) || [];

    let construct_titles = () => {
        let ret_val = [];
        for(let i = 0; i < props.names.length; i++){
            let is_selected = {selected: i === props.selected};
            ret_val.push(
                <PanelTitle key={props.names[i] + "_title"} {...is_selected} onClick={() => props.onSelect(i)}>
                    {props.names[i]}
                </PanelTitle>
            )
        }
        return ret_val;
    };
    
    return(
        <>
            <TitleBar name={props.names.join("_")}>
                {construct_titles()}
            </TitleBar>
            <ContentDiv>
                {childrenArray[props.selected]}
            </ContentDiv>
        </>
    );
};