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
import {PanelTitle, ContentDiv} from "./UIPanel";

export let TabbedContent = function (props) {
    const childrenArray = React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {key: child.key || Math.random().toString(36)})
        }
        return child;
    });

    let handle_select_tab = (event) => {
        props.onSelect(props.names.indexOf(event.target.textContent));
    }

    let construct_titles = () => {
        let ret_val = [];
        for(let i = 0; i < props.names.length; i++){
            let is_selected = {selected: i === props.selected};
            ret_val.push(
                <PanelTitle key={props.names[i] + "_title"} {...is_selected}>
                    <p style={{marginLeft:"0.5em", marginRight:"0.5em", marginTop:"0.25em"}} onClick={handle_select_tab}>{props.names[i]}</p>
                </PanelTitle>
            )
        }
        return ret_val;
    };
    
    return(
        <>
            <div style={{display:"flex"}}>
                {construct_titles()}
            </div>
            <ContentDiv>
                {childrenArray[props.selected]}
            </ContentDiv>
        </>
    );
};