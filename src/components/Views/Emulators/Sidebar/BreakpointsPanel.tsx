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


import React from 'react';
import {FieldPane, InputField, SelectableList} from "#UI/index.js";

interface BreakpointsPanelProps {
    breakpoints: number[],
    on_remove: (value: number) => void,
    on_add: (value: number) => void,
}

let  BreakpointsPanel = (props: BreakpointsPanelProps) =>{

    let handle_add = async (event: React.KeyboardEvent<HTMLInputElement>)=>{
        if(event.key==="Enter"|| event.key ==="Tab") {
            let line = parseInt(event.currentTarget.value);
            // a line that is not there is not a breakpoint
            if(!isNaN(line) && !props.breakpoints.includes(line)) props.on_add(line);
        }
    }

    let handle_remove = (name: string) =>{
        props.on_remove(parseInt(name.replace("Line ", "")));
    }

    let bp = [...props.breakpoints].sort((a, b) => a - b).map(breakpoint => "Line " + breakpoint);

    return (
        <FieldPane key="bp_view_contents">
            <InputField id="add_breakpoint" name="add_breakpoint" label="Add a breakpoint on line" onKeyDown={handle_add}/>
            <div style={{marginTop: "0.8rem"}}>
                {bp.length === 0
                    ? <div style={{fontSize: "0.85rem", opacity: 0.5, padding: "0 0.2rem"}}>No breakpoints, the emulation runs to the end</div>
                    : <SelectableList
                        onRemove={handle_remove}
                        items={bp}
                        style={{maxHeight: "12em", width: "auto"}}
                    />}
            </div>
        </FieldPane>
    );
};

export default BreakpointsPanel;
